using System.Net;
using System.Net.Mail;

namespace backend.Servicios
{
    /// <summary>
    /// Implementación del servicio de Email usando SMTP
    /// </summary>
    public class ServicioEmail : IServicioEmail
    {
        private readonly IConfiguration _configuracion;
        private readonly ILogger<ServicioEmail> _logger;
        private readonly string _emailOrigen;
        private readonly string _nombreOrigen;
        private readonly string _servidorSmtp;
        private readonly int _puertoSmtp;
        private readonly string _usuarioSmtp;
        private readonly string _contrasenaSmtp;
        private readonly bool _usarSsl;

        public ServicioEmail(IConfiguration configuracion, ILogger<ServicioEmail> logger)
        {
            _configuracion = configuracion;
            _logger = logger;

            // Leer configuración SMTP
            _emailOrigen = _configuracion["Smtp:EmailOrigen"] ?? throw new InvalidOperationException("Falta Smtp:EmailOrigen");
            _nombreOrigen = _configuracion["Smtp:NombreOrigen"] ?? "Frito Lay";
            _servidorSmtp = _configuracion["Smtp:Servidor"] ?? throw new InvalidOperationException("Falta Smtp:Servidor");
            _puertoSmtp = int.Parse(_configuracion["Smtp:Puerto"] ?? "587");
            _usuarioSmtp = _configuracion["Smtp:Usuario"] ?? throw new InvalidOperationException("Falta Smtp:Usuario");
            _contrasenaSmtp = _configuracion["Smtp:Contrasena"] ?? throw new InvalidOperationException("Falta Smtp:Contrasena");
            _usarSsl = bool.Parse(_configuracion["Smtp:UsarSSL"] ?? "true");

            _logger.LogInformation("Servicio de Email inicializado");
        }

        /// <summary>
        /// Sanitiza un valor de entrada para uso seguro en logs (elimina caracteres de salto de línea).
        /// </summary>
        private static string SanitizarParaLog(string? valor) =>
            valor?.Replace("\r", string.Empty).Replace("\n", string.Empty) ?? string.Empty;

        // ...existing code...

        /// <summary>
        /// Envía código de recuperación de contraseña
        /// </summary>
        public async Task<bool> EnviarCodigoRecuperacionAsync(string correoDestino, string nombreUsuario, string codigo)
        {
            try
            {
                _logger.LogInformation($"Iniciando envío de código de recuperación");

                var asunto = "🔐 Código de Recuperación - Frito Lay";
                
                var contenidoHtml = $@"
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset='utf-8' />
                        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
                        <style>
                            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 20px; }}
                            .container {{ max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }}
                            .header {{ background-color: #FDB913; color: white; text-align: center; padding: 20px; border-radius: 5px 5px 0 0; margin: -30px -30px 20px -30px; }}
                            .header h2 {{ margin: 0; font-size: 24px; }}
                            .codigo-box {{ background-color: #f9f9f9; border-left: 4px solid #FDB913; padding: 20px; margin: 20px 0; text-align: center; border-radius: 5px; }}
                            .codigo {{ background-color: #FDB913; color: white; font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 15px; border-radius: 5px; font-family: 'Courier New', monospace; }}
                            .advertencia {{ color: #d9534f; font-weight: bold; margin: 15px 0; }}
                            .footer {{ border-top: 1px solid #ddd; margin-top: 30px; padding-top: 15px; color: #999; font-size: 12px; text-align: center; }}
                            .link-seguridad {{ color: #0275d8; text-decoration: none; }}
                        </style>
                    </head>
                    <body>
                        <div class='container'>
                            <div class='header'>
                                <h2>🔐 Recuperación de Contraseña</h2>
                            </div>
                            
                            <p>¡Hola <strong>{nombreUsuario}</strong>!</p>
                            
                            <p>Hemos recibido una solicitud para recuperar tu contraseña. Usa el siguiente código de 6 dígitos:</p>
                            
                            <div class='codigo-box'>
                                <div class='codigo'>{codigo}</div>
                            </div>
                            
                            <p class='advertencia'>⏰ Este código expira en 5 minutos</p>
                            
                            <p style='color: #666; font-size: 14px;'>
                                <strong>Importante:</strong> Nunca compartas este código con nadie. El equipo de Frito Lay nunca te pedirá tu código por email, teléfono o redes sociales.
                            </p>
                            
                            <p style='color: #666; font-size: 14px;'>
                                Si no solicitaste esta recuperación, puedes ignorar este correo. Tu cuenta está segura.
                            </p>
                            
                            <div class='footer'>
                                <p>© 2026 Frito Lay. Todos los derechos reservados.</p>
                                <p>Este es un correo automático, por favor no respondas.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                ";

                return await EnviarEmailAsync(correoDestino, nombreUsuario, asunto, contenidoHtml);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error al enviar código de recuperación: "+ex.Message);
                return false;
            }
        }

        /// <summary>
        /// Envía email de confirmación de registro
        /// </summary>
        public async Task<bool> EnviarConfirmacionRegistroAsync(string correoDestino, string nombreUsuario)
        {
            try
            {
                _logger.LogInformation("Iniciando envío de confirmación de registro ");
                var asunto = "✅ ¡Bienvenido a Frito Lay!";
                var contenidoHtml = $@"
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset='utf-8' />
                        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
                        <style>
                            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 20px; }}
                            .container {{ max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }}
                            .header {{ background-color: #28a745; color: white; text-align: center; padding: 20px; border-radius: 5px 5px 0 0; margin: -30px -30px 20px -30px; }}
                            .header h2 {{ margin: 0; font-size: 24px; }}
                            .beneficios {{ background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }}
                            .beneficios ul {{ list-style: none; padding: 0; }}
                            .beneficios li {{ padding: 8px 0; color: #333; }}
                            .beneficios li:before {{ content: '✓ '; color: #28a745; font-weight: bold; }}
                            .boton {{ display: inline-block; background-color: #FDB913; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }}
                            .footer {{ border-top: 1px solid #ddd; margin-top: 30px; padding-top: 15px; color: #999; font-size: 12px; text-align: center; }}
                        </style>
                    </head>
                    <body>
                        <div class='container'>
                            <div class='header'>
                                <h2>✅ ¡Registro Exitoso!</h2>
                            </div>
                            
                            <p>¡Hola <strong>{nombreUsuario}</strong>!</p>
                            
                            <p>Tu cuenta en Frito Lay ha sido creada correctamente. Ahora puedes acceder a nuestra plataforma y disfrutar de nuestros productos.</p>
                            
                            <div class='beneficios'>
                                <h3>Con tu cuenta podrás:</h3>
                                <ul>
                                    <li>Navegar nuestro catálogo completo de productos</li>
                                    <li>Realizar pedidos de forma fácil y rápida</li>
                                    <li>Rastrear el estado de tus pedidos</li>
                                    <li>Guardar tus direcciones de entrega</li>
                                    <li>Recibir ofertas y promociones exclusivas</li>
                                </ul>
                            </div>
                            
                            <p style='text-align: center;'>
                                <a href='https://fritolayapp.com/login' class='boton'>Iniciar Sesión</a>
                            </p>
                            
                            <p style='color: #666; font-size: 14px;'>
                                Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos a <strong>soporte@fritolayapp.com</strong>
                            </p>
                            
                            <div class='footer'>
                                <p>© 2026 Frito Lay. Todos los derechos reservados.</p>
                                <p>Este es un correo automático, por favor no respondas.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                ";

                return await EnviarEmailAsync(correoDestino, nombreUsuario, asunto, contenidoHtml);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error al enviar confirmación de registro: "+ex.Message);
                return false;
            }
        }

        /// <summary>
        /// Método privado para enviar email genérico con manejo mejorado de SMTP
        /// </summary>
        private async Task<bool> EnviarEmailAsync(string correoDestino, string nombreDestino, string asunto, string contenidoHtml)
        {
            SmtpClient? cliente = null;
            try
            {
                _logger.LogInformation($"Conectando a servidor SMTP: {_servidorSmtp}:{_puertoSmtp}");

                cliente = new SmtpClient(_servidorSmtp, _puertoSmtp);

                // Configuración SMTP mejorada
                cliente.EnableSsl = _usarSsl;
                cliente.UseDefaultCredentials = false;
                cliente.Credentials = new NetworkCredential(_usuarioSmtp, _contrasenaSmtp);
                cliente.DeliveryMethod = SmtpDeliveryMethod.Network;

                // Timeouts
                cliente.Timeout = 10000;

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_emailOrigen, _nombreOrigen),
                    Subject = asunto,
                    Body = contenidoHtml,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(new MailAddress(correoDestino, nombreDestino));


                await cliente.SendMailAsync(mailMessage);

                _logger.LogInformation("Email enviado exitosamente");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error general al enviar email: "+ex.Message);
                _logger.LogError("   StackTrace: "+ ex.StackTrace);
                return false;
            }
            finally
            {
                cliente?.Dispose();
            }
        }
    }
}