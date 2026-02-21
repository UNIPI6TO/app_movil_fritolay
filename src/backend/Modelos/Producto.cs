using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Modelos
{
    public class Producto
    {
        [Key]
        public int IdProducto { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; }

        [MaxLength(500)]
        public string Descripcion { get; set; }

        
        [Column(TypeName = "decimal(18,2)")]
        public decimal PrecioBase { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal PorcentajeDescuento { get; set; } 

        [Column(TypeName = "decimal(5,2)")]
        public decimal PorcentajeImpuesto { get; set; } 

        public bool Activo { get; set; } = true;

        [MaxLength(100)]
        public string SKU { get; set; }

        public List<ImagenProducto> Imagenes { get; set; }

    }
    public class ImagenProducto
    {
        [Key]
        public int IdImagen { get; set; }

        [Required]
        public string UrlImagen { get; set; } 

        // Clave foránea
        public int IdProducto { get; set; }

        [ForeignKey("IdProducto")]
        [JsonIgnore] 
        public Producto Producto { get; set; }
    }
}
