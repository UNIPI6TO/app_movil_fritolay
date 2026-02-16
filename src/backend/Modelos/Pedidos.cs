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
        public string Estado { get; set; } // "Pendiente", "Pagado", "Enviado"

        [Required]
        public string MetodoPago { get; set; } // "Efectivo", "Transferencia", "Tarjeta"

        public string DireccionEntrega { get; set; }

        // Totales globales del pedido
        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalImpuestos { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPagar { get; set; }

        // Relación: Un pedido tiene muchos detalles (productos)
        public List<DetallePedido> Detalles { get; set; }
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

        // HISTÓRICO: Guardamos cuánto costaba y cuánto era el impuesto ESE DÍA
        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecioUnitarioFinal { get; set; } // Ya con descuento

        [Column(TypeName = "decimal(18,2)")]
        public decimal ImpuestoCobrado { get; set; } // Monto monetario del impuesto por unidad

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalLinea { get; set; }
    }
}
