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
            _logger.LogWarning($"🧪 Prueba de email solicitada a: {email}");

            var resultado = await _servicioEmail.EnviarConfirmacionRegistroAsync(email, "Usuario Prueba");
            
            if (resultado)
            {
                return Ok(new { 
                    mensaje = "✅ Email de prueba enviado exitosamente",
                    email = email,
                    timestamp = DateTime.UtcNow
                });
            }
            else
            {
                return StatusCode(500, new { 
                    error = "❌ No se pudo enviar el email",
                    email = email,
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
            _logger.LogWarning($"🧪 Prueba de email de código solicitada a: {email}");

            var codigoPrueba = "123456";
            var resultado = await _servicioEmail.EnviarCodigoRecuperacionAsync(email, "Usuario Prueba", codigoPrueba);
            
            if (resultado)
            {
                return Ok(new { 
                    mensaje = "✅ Email de código enviado exitosamente",
                    email = email,
                    codigoEnviado = codigoPrueba,
                    timestamp = DateTime.UtcNow,
                    nota = "En desarrollo: El código es 123456"
                });
            }
            else
            {
                return StatusCode(500, new { 
                    error = "❌ No se pudo enviar el email de código",
                    email = email,
                    consejo = "Revisa los logs del servidor y verifica la configuración SMTP en appsettings.json"
                });
            }
        }
    }
}
