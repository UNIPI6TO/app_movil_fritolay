using backend.Datos;
using backend.Modelos;
using backend.Modelos.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Pedido
{
    [Authorize] // REQ: Solo usuarios con Token JWT válido pueden entrar aquí
    [Route("api/[controller]")]
    [ApiController]
    public class ControladorPedidos : ControllerBase
    {
        private readonly ContextoBaseDatos _contexto;

        public ControladorPedidos(ContextoBaseDatos contexto)
        {
            _contexto = contexto;
        }

        // POST: api/pedidos/crear
        // RF-005: Creación de Pedido con Cálculo Seguro
        [HttpPost("crear")]
        public async Task<ActionResult> CrearPedido([FromBody] DtoCrearPedido solicitud)
        {
            // 1. Obtener ID del cliente desde el Token (Claim "idCliente")
            var idUsuarioClaim = User.FindFirst("idCliente");
            if (idUsuarioClaim == null) return Unauthorized("Token inválido.");

            int idCliente = int.Parse(idUsuarioClaim.Value);

            if (solicitud.Productos == null || !solicitud.Productos.Any())
            {
                return BadRequest("El pedido debe contener al menos un producto.");
            }

            // Usamos una transacción para asegurar que todo se guarde o nada se guarde
            using var transaccion = await _contexto.Database.BeginTransactionAsync();

            try
            {
                // 2. Crear la cabecera del Pedido
                var nuevoPedido = new backend.Modelos.Pedido
                {
                    IdCliente = idCliente,
                    FechaCreacion = DateTime.Now,
                    Estado = "Pendiente", // Estado inicial
                    MetodoPago = solicitud.MetodoPago,
                    DireccionEntrega = solicitud.DireccionEntrega,
                    ReferenciaTransferencia = solicitud.ReferenciaTransferencia,
                    LatitudEntrega = solicitud.LatitudEntrega,
                    LongitudEntrega = solicitud.LongitudEntrega,
                    Detalles = new List<DetallePedido>()
                };

                decimal acumuladorSubtotal = 0;
                decimal acumuladorDescuento = 0;
                decimal acumuladorImpuestos = 0;
                decimal acumuladorTotalPagar = 0;

                // 3. Iterar productos solicitados y RECALCULAR precios (No confiar en el frontend)
                foreach (var itemSolicitud in solicitud.Productos)
                {
                    var productoBd = await _contexto.Productos.FindAsync(itemSolicitud.IdProducto);

                    if (productoBd == null)
                    {
                        return BadRequest($"El producto con ID {itemSolicitud.IdProducto} no existe.");
                    }

                    if (!productoBd.Activo)
                    {
                        return BadRequest($"El producto '{productoBd.Nombre}' no está disponible.");
                    }

                    // --- LÓGICA DE CÁLCULO FINANCIERO (RF-004) ---

                    // A. Precio Base
                    decimal precioBase = productoBd.PrecioBase;
                    decimal subtotalLinea = precioBase * itemSolicitud.Cantidad;

                    // B. Descuento
                    decimal porcentajeDescuento = productoBd.PorcentajeDescuento;
                    decimal montoDescuentoUnitario = precioBase * (porcentajeDescuento / 100m);
                    decimal montoDescuentoTotal = montoDescuentoUnitario * itemSolicitud.Cantidad;
                    decimal precioConDescuento = precioBase - montoDescuentoUnitario;

                    // C. Impuesto Variable (según configuración del producto)
                    decimal porcentajeImpuesto = productoBd.PorcentajeImpuesto;
                    decimal montoImpuestoUnitario = precioConDescuento * (porcentajeImpuesto / 100m);
                    decimal montoImpuestoTotal = montoImpuestoUnitario * itemSolicitud.Cantidad;

                    // D. Totales por línea
                    decimal precioUnitarioFinal = precioConDescuento + montoImpuestoUnitario;
                    decimal totalLinea = precioUnitarioFinal * itemSolicitud.Cantidad;

                    // 4. Crear detalle con TODOS los campos de descuento e impuesto
                    var detalle = new DetallePedido
                    {
                        IdProducto = productoBd.IdProducto,
                        Cantidad = itemSolicitud.Cantidad,
                        
                        // PRECIO BASE Y SUBTOTAL
                        PrecioUnitarioBase = Math.Round(precioBase, 2),
                        SubtotalLinea = Math.Round(subtotalLinea, 2),
                        
                        // DESCUENTO
                        PorcentajeDescuento = Math.Round(porcentajeDescuento, 2),
                        ValorDescuento = Math.Round(montoDescuentoUnitario, 2),
                        DescuentoTotalLinea = Math.Round(montoDescuentoTotal, 2),
                        PrecioUnitarioConDescuento = Math.Round(precioConDescuento, 2),
                        
                        // IMPUESTO
                        PorcentajeImpuesto = Math.Round(porcentajeImpuesto, 2),
                        ValorImpuesto = Math.Round(montoImpuestoUnitario, 2),
                        ImpuestoTotalLinea = Math.Round(montoImpuestoTotal, 2),
                        
                        // TOTALES
                        PrecioUnitarioFinal = Math.Round(precioUnitarioFinal, 2),
                        TotalLinea = Math.Round(totalLinea, 2)
                    };

                    nuevoPedido.Detalles.Add(detalle);

                    // Acumular totales generales
                    acumuladorSubtotal += subtotalLinea;
                    acumuladorDescuento += montoDescuentoTotal;
                    acumuladorImpuestos += montoImpuestoTotal;
                    acumuladorTotalPagar += totalLinea;
                }

                // 5. Asignar totales a la cabecera
                nuevoPedido.Subtotal = Math.Round(acumuladorSubtotal, 2);
                nuevoPedido.TotalDescuento = Math.Round(acumuladorDescuento, 2);
                nuevoPedido.TotalImpuestos = Math.Round(acumuladorImpuestos, 2);
                nuevoPedido.TotalPagar = Math.Round(acumuladorTotalPagar, 2);

                // 6. Guardar en Base de Datos
                _contexto.Pedidos.Add(nuevoPedido);
                await _contexto.SaveChangesAsync();

                // Confirmar transacción
                await transaccion.CommitAsync();

                return Ok(new
                {
                    mensaje = "Pedido creado exitosamente",
                    idPedido = nuevoPedido.IdPedido,
                    totalCobrado = nuevoPedido.TotalPagar
                });
            }
            catch (Exception ex)
            {
                await transaccion.RollbackAsync();
                return StatusCode(500, "Error interno al procesar el pedido: " + ex.Message);
            }
        }

        // GET: api/pedidos/mis-pedidos
        // RF-015: Historial de Usuario
        [HttpGet("mis-pedidos")]
        public async Task<ActionResult> ObtenerMisPedidos()
        {
            var idUsuarioClaim = User.FindFirst("idCliente");
            int idCliente = int.Parse(idUsuarioClaim.Value);

            var historial = await _contexto.Pedidos
                .Where(p => p.IdCliente == idCliente)
                .Include(p => p.Detalles)
                    .ThenInclude(d => d.Producto) // Incluir datos del producto para mostrar nombre
                .OrderByDescending(p => p.FechaCreacion)
                .Select(p => new
                {
                    p.IdPedido,
                    p.FechaCreacion,
                    p.Estado,
                    p.Subtotal,
                    p.TotalDescuento,
                    p.TotalImpuestos,
                    p.TotalPagar,
                    p.MetodoPago,
                    CantidadItems = p.Detalles.Sum(d => d.Cantidad),
                    ResumenProductos = p.Detalles.Select(d => new
                    {
                        d.Producto.Nombre,
                        d.Cantidad,
                        d.PrecioUnitarioBase,
                        d.PorcentajeDescuento,
                        d.ValorDescuento,
                        d.PrecioUnitarioConDescuento,
                        d.PorcentajeImpuesto,
                        d.ValorImpuesto,
                        d.PrecioUnitarioFinal,
                        d.SubtotalLinea,
                        d.DescuentoTotalLinea,
                        d.ImpuestoTotalLinea,
                        d.TotalLinea
                    })
                })
                .ToListAsync();

            return Ok(historial);
        }

        // GET: api/pedidos/{id}
        // Obtener un pedido específico del usuario por su ID
        [HttpGet("{id}")]
        public async Task<ActionResult> ObtenerPedido(int id)
        {
            var idUsuarioClaim = User.FindFirst("idCliente");
            if (idUsuarioClaim == null) return Unauthorized("Token inválido.");
            int idCliente = int.Parse(idUsuarioClaim.Value);

            var pedido = await _contexto.Pedidos
                .Where(p => p.IdPedido == id && p.IdCliente == idCliente)
                .Include(p => p.Detalles)
                    .ThenInclude(d => d.Producto)
                .Select(p => new
                {
                    p.IdPedido,
                    p.FechaCreacion,
                    p.Estado,
                    p.Subtotal,
                    p.TotalDescuento,
                    p.TotalImpuestos,
                    p.TotalPagar,
                    p.MetodoPago,
                    p.MontoTotalPagado,
                    CantidadItems = p.Detalles.Sum(d => d.Cantidad),
                    ResumenProductos = p.Detalles.Select(d => new
                    {
                        d.Producto.Nombre,
                        d.Cantidad,
                        d.PrecioUnitarioBase,
                        d.PorcentajeDescuento,
                        d.ValorDescuento,
                        d.PrecioUnitarioConDescuento,
                        d.PorcentajeImpuesto,
                        d.ValorImpuesto,
                        d.PrecioUnitarioFinal,
                        d.SubtotalLinea,
                        d.DescuentoTotalLinea,
                        d.ImpuestoTotalLinea,
                        d.TotalLinea
                    })
                })
                .FirstOrDefaultAsync();

            if (pedido == null) return NotFound("El pedido no existe o no te pertenece.");

            return Ok(pedido);
        }

        // POST: api/pedidos/registrar-pago
        // Registrar un pago para un pedido
        [HttpPost("registrar-pago")]
        public async Task<ActionResult> RegistrarPago([FromBody] DtoRegistroPago solicitud)
        {
            // Validar token y obtener ID del cliente
            var idUsuarioClaim = User.FindFirst("idCliente");
            if (idUsuarioClaim == null) return Unauthorized("Token inválido.");
            int idCliente = int.Parse(idUsuarioClaim.Value);

            // Validar que el pedido exista y pertenezca al cliente
            var pedido = await _contexto.Pedidos.FirstOrDefaultAsync(p => p.IdPedido == solicitud.IdPedido && p.IdCliente == idCliente);
            if (pedido == null) return NotFound("El pedido no existe o no te pertenece.");

            // Validar el monto del pago
            if (solicitud.MontoPagado <= 0) return BadRequest("El monto pagado debe ser mayor a 0.");

            var montoPendiente = pedido.TotalPagar - pedido.MontoTotalPagado;
            if (solicitud.MontoPagado > montoPendiente)
            {
                return BadRequest($"El monto a pagar excede lo pendiente. Pendiente: {montoPendiente}");
            }

            // Crear registro de pago
            var pago = new PagoPedido
            {
                IdPedido = solicitud.IdPedido,
                MontoPagado = solicitud.MontoPagado,
                MetodoPagoUtilizado = solicitud.MetodoPagoUtilizado,
                ReferenciaPago = solicitud.ReferenciaPago,
                Observaciones = solicitud.Observaciones,
                FechaPago = DateTime.Now
            };

            // Actualizar monto total pagado del pedido
            pedido.MontoTotalPagado += solicitud.MontoPagado;

            // Si ya está completamente pagado, marcar fecha de confirmación
            if (pedido.MontoTotalPagado >= pedido.TotalPagar)
            {
                pedido.MontoTotalPagado = pedido.TotalPagar;
                pedido.FechaConfirmacionPago = DateTime.Now;
                pedido.Estado = "Pagado";
            }

            _contexto.PagosPedido.Add(pago);
            await _contexto.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Pago registrado exitosamente",
                idPago = pago.IdPago,
                montoPagado = pago.MontoPagado,
                montoTotalPagado = pedido.MontoTotalPagado,
                montoPendiente = pedido.TotalPagar - pedido.MontoTotalPagado,
                estadoPago = pedido.FechaConfirmacionPago == null ? "Pendiente" : "Completado"
            });
        }

        // POST: api/pedidos/registrar-pagos
        // Registrar múltiples pagos para un pedido
        [HttpPost("registrar-pagos")]
        public async Task<ActionResult> RegistrarPagosMultiples([FromBody] DtoRegistrosPagosMultiples solicitud)
        {
            var idUsuarioClaim = User.FindFirst("idCliente");
            if (idUsuarioClaim == null) return Unauthorized("Token inválido.");
            int idCliente = int.Parse(idUsuarioClaim.Value);

            if (solicitud.Pagos == null || !solicitud.Pagos.Any())
                return BadRequest("Debe proporcionar al menos un pago.");

            using var transaccion = await _contexto.Database.BeginTransactionAsync();

            try
            {
                var registros = new List<object>();

                foreach (var pagoDatos in solicitud.Pagos)
                {
                    var pedido = await _contexto.Pedidos.FirstOrDefaultAsync(p => p.IdPedido == pagoDatos.IdPedido && p.IdCliente == idCliente);
                    if (pedido == null) continue;

                    if (pagoDatos.MontoPagado <= 0) continue;

                    var montoPendiente = pedido.TotalPagar - pedido.MontoTotalPagado;
                    if (pagoDatos.MontoPagado > montoPendiente) continue;

                    var pago = new PagoPedido
                    {
                        IdPedido = pagoDatos.IdPedido,
                        MontoPagado = pagoDatos.MontoPagado,
                        MetodoPagoUtilizado = pagoDatos.MetodoPagoUtilizado,
                        ReferenciaPago = pagoDatos.ReferenciaPago,
                        Observaciones = pagoDatos.Observaciones,
                        FechaPago = DateTime.Now
                    };

                    pedido.MontoTotalPagado += pagoDatos.MontoPagado;

                    if (pedido.MontoTotalPagado >= pedido.TotalPagar)
                    {
                        pedido.MontoTotalPagado = pedido.TotalPagar;
                        pedido.FechaConfirmacionPago = DateTime.Now;
                        pedido.Estado = "Pagado";
                    }

                    _contexto.PagosPedido.Add(pago);
                    registros.Add(new { pagoDatos.IdPedido, pago.IdPago, pagoDatos.MontoPagado });
                }

                await _contexto.SaveChangesAsync();
                await transaccion.CommitAsync();

                return Ok(new
                {
                    mensaje = "Pagos registrados exitosamente",
                    cantidadPagosRegistrados = registros.Count,
                    pagos = registros
                });
            }
            catch (Exception ex)
            {
                await transaccion.RollbackAsync();
                return StatusCode(500, "Error al registrar pagos: " + ex.Message);
            }
        }

        // POST: api/pedidos/registrar-entrega
        // Registrar una entrega para un pedido
        [HttpPost("registrar-entrega")]
        public async Task<ActionResult> RegistrarEntrega([FromBody] DtoRegistroEntrega solicitud)
        {
            var idUsuarioClaim = User.FindFirst("idCliente");
            if (idUsuarioClaim == null) return Unauthorized("Token inválido.");
            int idCliente = int.Parse(idUsuarioClaim.Value);

            var pedido = await _contexto.Pedidos.FirstOrDefaultAsync(p => p.IdPedido == solicitud.IdPedido && p.IdCliente == idCliente);
            if (pedido == null) return NotFound("El pedido no existe o no te pertenece.");

            if (solicitud.CantidadEntregada <= 0) return BadRequest("La cantidad entregada debe ser mayor a 0.");

            var cantidadPendiente = pedido.Detalles.Sum(d => d.Cantidad) - pedido.CantidadEntregada;
            if (solicitud.CantidadEntregada > cantidadPendiente)
            {
                return BadRequest($"La cantidad a entregar excede la pendiente. Pendiente: {cantidadPendiente}");
            }

            var entrega = new EntregaPedido
            {
                IdPedido = solicitud.IdPedido,
                CantidadEntregada = solicitud.CantidadEntregada,
                Estado = solicitud.Estado,
                Observaciones = solicitud.Observaciones,
                ReferenciaSeguimiento = solicitud.ReferenciaSeguimiento,
                LatitudEntrega = solicitud.LatitudEntrega,
                LongitudEntrega = solicitud.LongitudEntrega,
                DireccionEntregaReal = solicitud.DireccionEntregaReal,
                FechaEntrega = DateTime.Now
            };

            pedido.CantidadEntregada += solicitud.CantidadEntregada;

            var cantidadTotalProductos = pedido.Detalles.Sum(d => d.Cantidad);
            if (pedido.CantidadEntregada >= cantidadTotalProductos)
            {
                pedido.CantidadEntregada = cantidadTotalProductos;
                pedido.FechaEntrega = DateTime.Now;
                if (pedido.Estado == "Pagado")
                    pedido.Estado = "Entregado";
            }

            _contexto.EntregasPedido.Add(entrega);
            await _contexto.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Entrega registrada exitosamente",
                idEntrega = entrega.IdEntrega,
                cantidadEntregada = entrega.CantidadEntregada,
                cantidadTotalEntregada = pedido.CantidadEntregada,
                cantidadPendiente = cantidadTotalProductos - pedido.CantidadEntregada,
                estadoEntrega = pedido.FechaEntrega == null ? "Pendiente" : "Completado"
            });
        }

        // POST: api/pedidos/registrar-entregas
        // Registrar múltiples entregas para un pedido
        [HttpPost("registrar-entregas")]
        public async Task<ActionResult> RegistrarEntregasMultiples([FromBody] DtoRegistrosEntregasMultiples solicitud)
        {
            var idUsuarioClaim = User.FindFirst("idCliente");
            if (idUsuarioClaim == null) return Unauthorized("Token inválido.");
            int idCliente = int.Parse(idUsuarioClaim.Value);

            if (solicitud.Entregas == null || !solicitud.Entregas.Any())
                return BadRequest("Debe proporcionar al menos una entrega.");

            using var transaccion = await _contexto.Database.BeginTransactionAsync();

            try
            {
                var registros = new List<object>();

                foreach (var entregaDatos in solicitud.Entregas)
                {
                    var pedido = await _contexto.Pedidos
                        .Include(p => p.Detalles)
                        .FirstOrDefaultAsync(p => p.IdPedido == entregaDatos.IdPedido && p.IdCliente == idCliente);
                    
                    if (pedido == null) continue;
                    if (entregaDatos.CantidadEntregada <= 0) continue;

                    var cantidadPendiente = pedido.Detalles.Sum(d => d.Cantidad) - pedido.CantidadEntregada;
                    if (entregaDatos.CantidadEntregada > cantidadPendiente) continue;

                    var entrega = new EntregaPedido
                    {
                        IdPedido = entregaDatos.IdPedido,
                        CantidadEntregada = entregaDatos.CantidadEntregada,
                        Estado = entregaDatos.Estado,
                        Observaciones = entregaDatos.Observaciones,
                        ReferenciaSeguimiento = entregaDatos.ReferenciaSeguimiento,
                        LatitudEntrega = entregaDatos.LatitudEntrega,
                        LongitudEntrega = entregaDatos.LongitudEntrega,
                        DireccionEntregaReal = entregaDatos.DireccionEntregaReal,
                        FechaEntrega = DateTime.Now
                    };

                    pedido.CantidadEntregada += entregaDatos.CantidadEntregada;

                    var cantidadTotalProductos = pedido.Detalles.Sum(d => d.Cantidad);
                    if (pedido.CantidadEntregada >= cantidadTotalProductos)
                    {
                        pedido.CantidadEntregada = cantidadTotalProductos;
                        pedido.FechaEntrega = DateTime.Now;
                        if (pedido.Estado == "Pagado")
                            pedido.Estado = "Entregado";
                    }

                    _contexto.EntregasPedido.Add(entrega);
                    registros.Add(new { entregaDatos.IdPedido, entrega.IdEntrega, entregaDatos.CantidadEntregada });
                }

                await _contexto.SaveChangesAsync();
                await transaccion.CommitAsync();

                return Ok(new
                {
                    mensaje = "Entregas registradas exitosamente",
                    cantidadEntregasRegistradas = registros.Count,
                    entregas = registros
                });
            }
            catch (Exception ex)
            {
                await transaccion.RollbackAsync();
                return StatusCode(500, "Error al registrar entregas: " + ex.Message);
            }
        }

        // GET: api/pedidos/{id}/pagos
        // Obtener historial de pagos de un pedido
        [HttpGet("{id}/pagos")]
        public async Task<ActionResult> ObtenerPagosPedido(int id)
        {
            var idUsuarioClaim = User.FindFirst("idCliente");
            if (idUsuarioClaim == null) return Unauthorized("Token inválido.");
            int idCliente = int.Parse(idUsuarioClaim.Value);

            var pedido = await _contexto.Pedidos.FirstOrDefaultAsync(p => p.IdPedido == id && p.IdCliente == idCliente);
            if (pedido == null) return NotFound("El pedido no existe o no te pertenece.");

            var pagos = await _contexto.PagosPedido
                .Where(p => p.IdPedido == id)
                .OrderByDescending(p => p.FechaPago)
                .Select(p => new
                {
                    p.IdPago,
                    p.MontoPagado,
                    p.FechaPago,
                    p.MetodoPagoUtilizado,
                    p.ReferenciaPago,
                    p.Observaciones
                })
                .ToListAsync();

            return Ok(new
            {
                idPedido = id,
                montoTotalPagar = pedido.TotalPagar,
                montoTotalPagado = pedido.MontoTotalPagado,
                montoPendiente = pedido.TotalPagar - pedido.MontoTotalPagado,
                fechaConfirmacionPago = pedido.FechaConfirmacionPago,
                pagos = pagos
            });
        }

        // GET: api/pedidos/{id}/entregas
        // Obtener historial de entregas de un pedido
        [HttpGet("{id}/entregas")]
        public async Task<ActionResult> ObtenerEntregasPedido(int id)
        {
            var idUsuarioClaim = User.FindFirst("idCliente");
            if (idUsuarioClaim == null) return Unauthorized("Token inválido.");
            int idCliente = int.Parse(idUsuarioClaim.Value);

            var pedido = await _contexto.Pedidos
                .Include(p => p.Detalles)
                .FirstOrDefaultAsync(p => p.IdPedido == id && p.IdCliente == idCliente);
            
            if (pedido == null) return NotFound("El pedido no existe o no te pertenece.");

            var entregas = await _contexto.EntregasPedido
                .Where(e => e.IdPedido == id)
                .OrderByDescending(e => e.FechaEntrega)
                .Select(e => new
                {
                    e.IdEntrega,
                    e.CantidadEntregada,
                    e.FechaEntrega,
                    e.Estado,
                    e.Observaciones,
                    e.ReferenciaSeguimiento,
                    e.LatitudEntrega,
                    e.LongitudEntrega,
                    e.DireccionEntregaReal
                })
                .ToListAsync();

            var cantidadTotalProductos = pedido.Detalles.Sum(d => d.Cantidad);

            return Ok(new
            {
                idPedido = id,
                cantidadTotalProductos = cantidadTotalProductos,
                cantidadTotalEntregada = pedido.CantidadEntregada,
                cantidadPendiente = cantidadTotalProductos - pedido.CantidadEntregada,
                fechaEntrega = pedido.FechaEntrega,
                entregas = entregas
            });
        }
    }
}
