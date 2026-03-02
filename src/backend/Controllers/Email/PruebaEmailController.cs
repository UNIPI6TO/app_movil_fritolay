using Microsoft.AspNetCore.Mvc;
using backend.Servicios;

namespace backend.Controllers.Email
{
    [ApiController]
    [Route("api/[controller]")]
    public class PruebaEmailController : ControllerBase
    {
        private readonly IServicioEmail _servicioEmail;
        private readonly ILogger<PruebaEmailController> _logger;

        public PruebaEmailController(IServicioEmail servicioEmail, ILogger<PruebaEmailController> logger)
        {
            _servicioEmail = servicioEmail;
            _logger = logger;
        }

        /// <summary>
        /// Prueba conexión SMTP enviando un email de prueba
        /// ⚠️ SOLO USAR EN DESARROLLO
        /// </summary>
        [HttpPost("enviar-prueba/{email}")]
        public async Task<IActionResult> EnviarPrueba(string email)
        {
            var emailRedactado = RedactarEmail(email);
            _logger.LogWarning("🧪 Prueba de email solicitada.");

            var resultado = await _servicioEmail.EnviarConfirmacionRegistroAsync(email, "Usuario Prueba");
            
            if (resultado)
            {
                return Ok(new { 
                    mensaje = "✅ Email de prueba enviado exitosamente",
                    emailRedactado,
                    timestamp = DateTime.UtcNow
                });
            }
            else
            {
                return StatusCode(500, new { 
                    error = "❌ No se pudo enviar el email",
                    emailRedactado,
                    consejo = "Revisa los logs del servidor y verifica la configuración SMTP en appsettings.json"
                });
            }
        }

        /// <summary>
        /// Prueba envío de código de recuperación
        /// ⚠️ SOLO USAR EN DESARROLLO
        /// </summary>
        [HttpPost("enviar-codigo-prueba/{email}")]
        public async Task<IActionResult> EnviarCodigoPrueba(string email)
        {
            var emailRedactado = RedactarEmail(email);
            _logger.LogWarning("🧪 Prueba de email de código solicitada.");

            var codigoPrueba = "123456";
            var resultado = await _servicioEmail.EnviarCodigoRecuperacionAsync(email, "Usuario Prueba", codigoPrueba);
            
            if (resultado)
            {
                return Ok(new { 
                    mensaje = "✅ Email de código enviado exitosamente",
                    emailRedactado,
                    codigoEnviado = codigoPrueba,
                    timestamp = DateTime.UtcNow,
                    nota = "En desarrollo: El código es 123456"
                });
            }
            else
            {
                return StatusCode(500, new { 
                    error = "❌ No se pudo enviar el email de código",
                    emailRedactado,
                    consejo = "Revisa los logs del servidor y verifica la configuración SMTP en appsettings.json"
                });
            }
        }

        private static string RedactarEmail(string? email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return string.Empty;
            }

            var partes = email.Split('@');
            if (partes.Length != 2 || string.IsNullOrEmpty(partes[0]))
            {
                return "***";
            }

            var usuario = partes[0];
            var dominio = partes[1];

            var visible = usuario[0];
            return $"{visible}***@{dominio}";
        }
    }
}
