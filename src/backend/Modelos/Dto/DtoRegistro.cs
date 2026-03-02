using System.ComponentModel.DataAnnotations;

namespace backend.Modelos.Dto
{
    //Para registrarse
    public class DtoRegistro
    {
        [Required]
        public string Cedula { get; set; } 

        [Required]
        public string NombreCompleto { get; set; }

        [Required]
        [EmailAddress]
        public string CorreoElectronico { get; set; }

        [Required]
        public string Contrasena { get; set; }
        public string Telefono { get; set; }
        public string Direccion { get; set; }
    }
    // Para Login
    public class DtoLogin
    {
        public string CorreoElectronico { get; set; }
        public string Contrasena { get; set; }
    }
    // Para Restablecer Contraseña
    public class DtoRestablecer
    {
        public string CorreoElectronico { get; set; }
        public string CodigoVerificacion { get; set; }
        public string NuevaContrasena { get; set; }
    }

    // Para Solicitar recuperación (cuerpo JSON)
    public class DtoRecuperar
    {
        public string CorreoElectronico { get; set; }
    }
}
