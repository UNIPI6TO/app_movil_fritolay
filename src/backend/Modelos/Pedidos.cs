using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Modelos
{
    public class Pedido
    {
        [Key]
        public int IdPedido { get; set; }

        public int IdCliente { get; set; }
        [ForeignKey("IdCliente")]
        public Cliente Cliente { get; set; }

        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        [Required]
        public string Estado { get; set; } // "Pendiente", "Pagado", "Enviado", "Entregado"

        [Required]
        public string MetodoPago { get; set; } // "Efectivo", "Transferencia", "Tarjeta"

        public string DireccionEntrega { get; set; }
        
        // Referencia de transferencia (si aplica)
        public string ReferenciaTransferencia { get; set; }

        // COORDENADAS GPS: Ubicación de entrega solicitada por el cliente
        [Column(TypeName = "decimal(18,8)")]
        public decimal? LatitudEntrega { get; set; }

        [Column(TypeName = "decimal(18,8)")]
        public decimal? LongitudEntrega { get; set; }

        // PAGOS: Control de pagos parciales o completos
        [Column(TypeName = "decimal(18,2)")]
        public decimal MontoTotalPagado { get; set; } = 0; // Total pagado hasta ahora
        
        public DateTime? FechaConfirmacionPago { get; set; } // Fecha cuando se pagó completamente

        // ENTREGAS: Control de entregas parciales o completas
        public DateTime? FechaEntrega { get; set; } // Fecha cuando se entregó completamente
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal CantidadEntregada { get; set; } = 0; // Cantidad total entregada

        // Relaciones: Un pedido puede tener múltiples pagos y entregas
        public List<PagoPedido> Pagos { get; set; }
        public List<EntregaPedido> Entregas { get; set; }

        // Totales globales del pedido: DESGLOSE COMPLETO
        // Subtotal sin descuentos ni impuestos
        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; }

        // DESCUENTOS: Información de descuentos del pedido completo
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalDescuento { get; set; } = 0; // Suma de todos los descuentos aplicados

        // IMPUESTOS: Información de impuestos del pedido completo
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalImpuestos { get; set; }

        // TOTAL: Monto final a pagar
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPagar { get; set; } // Subtotal - Descuentos + Impuestos

        // Relación: Un pedido tiene muchos detalles (productos)
        public List<DetallePedido> Detalles { get; set; }
    }

    // MODELO: Registro de Pagos (permite pagos parciales)
    public class PagoPedido
    {
        [Key]
        public int IdPago { get; set; }

        public int IdPedido { get; set; }
        [ForeignKey("IdPedido")]
        [JsonIgnore]
        public Pedido Pedido { get; set; }

        // Detalles del pago
        [Column(TypeName = "decimal(18,2)")]
        public decimal MontoPagado { get; set; } // Cantidad pagada en esta transacción

        public DateTime FechaPago { get; set; } = DateTime.Now;

        [Required]
        public string MetodoPagoUtilizado { get; set; } // "Efectivo", "Transferencia", "Tarjeta", etc.

        public string ReferenciaPago { get; set; } // Número de transacción, número de comprobante, etc.

        public string Observaciones { get; set; } // Notas adicionales sobre el pago
    }

    // MODELO: Registro de Entregas (permite entregas parciales)
    public class EntregaPedido
    {
        [Key]
        public int IdEntrega { get; set; }

        public int IdPedido { get; set; }
        [ForeignKey("IdPedido")]
        [JsonIgnore]
        public Pedido Pedido { get; set; }

        // Detalles de la entrega
        public int CantidadEntregada { get; set; } // Cantidad entregada en esta ocasión

        public DateTime FechaEntrega { get; set; } = DateTime.Now;

        public string Estado { get; set; } // "Entregado", "Parcial", "Fallida"

        public string Observaciones { get; set; } // Notas sobre la entrega (nombre de quien recibió, etc.)

        public string ReferenciaSeguimiento { get; set; } // Número de guía, referencia de courier, etc.

        // COORDENADAS: Ubicación GPS de entrega
        [Column(TypeName = "decimal(18,8)")]
        public decimal? LatitudEntrega { get; set; } // Latitud de la ubicación de entrega

        [Column(TypeName = "decimal(18,8)")]
        public decimal? LongitudEntrega { get; set; } // Longitud de la ubicación de entrega

        public string DireccionEntregaReal { get; set; } // Dirección exacta donde se entregó
    }

    public class DetallePedido
    {
        [Key]
        public int IdDetalle { get; set; }

        public int IdPedido { get; set; }
        [ForeignKey("IdPedido")]
        [JsonIgnore]
        public Pedido Pedido { get; set; }

        public int IdProducto { get; set; }
        [ForeignKey("IdProducto")]
        public Producto Producto { get; set; }

        public int Cantidad { get; set; }

        // HISTÓRICO: Guardamos precios base como estaban ESE DÍA
        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecioUnitarioBase { get; set; } // Precio sin descuento ni impuesto

        // DESCUENTO: Información del descuento aplicado
        public decimal PorcentajeDescuento { get; set; } = 0; // Porcentaje de descuento (0-100)

        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorDescuento { get; set; } = 0; // Monto monetario del descuento por unidad

        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecioUnitarioConDescuento { get; set; } // Precio después de aplicar descuento

        // IMPUESTOS: Información del impuesto aplicado
        public decimal PorcentajeImpuesto { get; set; } = 0; // Porcentaje de impuesto/IVA (0-100)

        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorImpuesto { get; set; } = 0; // Monto monetario del impuesto por unidad

        // TOTAL: Precio final por unidad
        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecioUnitarioFinal { get; set; } // Precio final = PrecioConDescuento + Impuesto

        // TOTAL LÍNEA: Detalles completos por línea
        [Column(TypeName = "decimal(18,2)")]
        public decimal SubtotalLinea { get; set; } // Subtotal sin impuestos (PrecioBase * Cantidad)

        [Column(TypeName = "decimal(18,2)")]
        public decimal DescuentoTotalLinea { get; set; } // Total descuento en la línea (ValorDescuento * Cantidad)

        [Column(TypeName = "decimal(18,2)")]
        public decimal ImpuestoTotalLinea { get; set; } // Total impuestos en la línea (ValorImpuesto * Cantidad)

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalLinea { get; set; } // Total final de la línea
    }
}
