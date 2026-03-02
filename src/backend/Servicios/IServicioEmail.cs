namespace backend.Servicios
{
    /// <summary>
    /// Servicio para enviar emails en la aplicación
    /// </summary>
    public interface IServicioEmail
    {
        /// <summary>
        /// Envía un código de recuperación de contraseña al correo del usuario
        /// </summary>
        /// <param name="correoDestino">Correo destino</param>
        /// <param name="nombreUsuario">Nombre del usuario</param>
        /// <param name="codigo">Código de 6 dígitos para recuperación</param>
        /// <returns>True si el email fue enviado exitosamente</returns>
        Task<bool> EnviarCodigoRecuperacionAsync(string correoDestino, string nombreUsuario, string codigo);

        /// <summary>
        /// Envía un email de bienvenida al nuevo usuario registrado
        /// </summary>
        /// <param name="correoDestino">Correo destino</param>
        /// <param name="nombreUsuario">Nombre del usuario</param>
        /// <returns>True si el email fue enviado exitosamente</returns>
        Task<bool> EnviarConfirmacionRegistroAsync(string correoDestino, string nombreUsuario);
    }
}
