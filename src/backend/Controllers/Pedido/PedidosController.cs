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
                    Detalles = new List<DetallePedido>()
                };

                decimal acumuladorSubtotal = 0;
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

                    // B. Descuento
                    decimal montoDescuento = precioBase * (productoBd.PorcentajeDescuento / 100m);
                    decimal precioConDescuento = precioBase - montoDescuento;

                    // C. Impuesto Variable (según configuración del producto)
                    decimal montoImpuestoUnitario = precioConDescuento * (productoBd.PorcentajeImpuesto / 100m);

                    // D. Totales por línea
                    decimal precioUnitarioFinal = precioConDescuento + montoImpuestoUnitario;
                    decimal totalLinea = precioUnitarioFinal * itemSolicitud.Cantidad;

                    // 4. Crear detalle
                    var detalle = new DetallePedido
                    {
                        IdProducto = productoBd.IdProducto,
                        Cantidad = itemSolicitud.Cantidad,
                        // Guardamos el histórico de precios
                        PrecioUnitarioFinal = Math.Round(precioUnitarioFinal, 2),
                        ImpuestoCobrado = Math.Round(montoImpuestoUnitario * itemSolicitud.Cantidad, 2),
                        TotalLinea = Math.Round(totalLinea, 2)
                    };

                    nuevoPedido.Detalles.Add(detalle);

                    // Acumular totales generales
                    acumuladorSubtotal += (precioConDescuento * itemSolicitud.Cantidad);
                    acumuladorImpuestos += (montoImpuestoUnitario * itemSolicitud.Cantidad);
                    acumuladorTotalPagar += totalLinea;
                }

                // 5. Asignar totales a la cabecera
                nuevoPedido.Subtotal = Math.Round(acumuladorSubtotal, 2);
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
                    p.TotalPagar,
                    p.MetodoPago,
                    CantidadItems = p.Detalles.Sum(d => d.Cantidad),
                    ResumenProductos = p.Detalles.Select(d => new
                    {
                        d.Producto.Nombre,
                        d.Cantidad,
                        d.TotalLinea
                    })
                })
                .ToListAsync();

            return Ok(historial);
        }
    }
}
