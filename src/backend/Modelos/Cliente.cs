using System.ComponentModel.DataAnnotations;

namespace backend.Modelos
{
    public class Cliente
    {
        [Key]
        public int IdCliente { get; set; }
        [MaxLength(20)]
        
        [Required]
        public string Cedula { get; set; } // 

        [Required]
        public string NombreCompleto { get; set; }

        [Required]
        public string CorreoElectronico { get; set; }

        [Required]
        public string ContrasenaHash { get; set; }
        public string Telefono { get; set; }
        public string Direccion { get; set; }

        public string? CodigoRecuperacion { get; set; }
        public DateTime? ExpiracionCodigo { get; set; }
    }
}
