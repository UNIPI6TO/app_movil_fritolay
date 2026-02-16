using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Datos;
using backend.Modelos;
using backend.Modelos.Dto;
using BCrypt.Net;

namespace backend.Controllers.Usuario
{
    [Route("api/[controller]")]
    [ApiController]
    public class ControladorCuenta : ControllerBase
    {
        private readonly ContextoBaseDatos _contexto;
        private readonly IConfiguration _configuracion;

        public ControladorCuenta(ContextoBaseDatos contexto, IConfiguration configuracion)
        {
            _contexto = contexto;
            _configuracion = configuracion;
        }

        // RF-001: Registro de Cliente (Actualizado con Cédula)
        [HttpPost("registrar")]
        public async Task<IActionResult> Registrar([FromBody] DtoRegistro datos)
        {
            // Validamos si ya existe el correo O la cédula
            if (await _contexto.Clientes.AnyAsync(c => c.CorreoElectronico == datos.CorreoElectronico || c.Cedula == datos.Cedula))
            {
                return BadRequest("El correo electrónico o la cédula ya están registrados.");
            }

            string hash = BCrypt.Net.BCrypt.HashPassword(datos.Contrasena);

            var nuevoCliente = new Cliente
            {
                Cedula = datos.Cedula, 
                NombreCompleto = datos.NombreCompleto,
                CorreoElectronico = datos.CorreoElectronico,
                ContrasenaHash = hash,
                Telefono = datos.Telefono,
                Direccion = datos.Direccion
            };

            _contexto.Clientes.Add(nuevoCliente);
            await _contexto.SaveChangesAsync();

            return Ok(new { mensaje = "Usuario registrado exitosamente." });
        }

        // RF-002: Inicio de Sesión
        [HttpPost("login")]
        public async Task<IActionResult> IniciarSesion([FromBody] DtoLogin datos)
        {
            var cliente = await _contexto.Clientes
                .FirstOrDefaultAsync(c => c.CorreoElectronico == datos.CorreoElectronico);

            if (cliente == null || !BCrypt.Net.BCrypt.Verify(datos.Contrasena, cliente.ContrasenaHash))
            {
                return Unauthorized("Credenciales incorrectas.");
            }

            var token = GenerarTokenJwt(cliente);

            return Ok(new
            {
                tokenAcceso = token,
                idUsuario = cliente.IdCliente,
                nombreUsuario = cliente.NombreCompleto,
                cedula = cliente.Cedula, 
                correo = cliente.CorreoElectronico
            });
        }

        // RF-011: Solicitar Recuperación (Generar Código)
        [HttpPost("recuperar")]
        public async Task<IActionResult> SolicitarRecuperacion([FromBody] string correo)
        {
            var cliente = await _contexto.Clientes.FirstOrDefaultAsync(c => c.CorreoElectronico == correo);
            if (cliente == null) return NotFound("Correo no encontrado.");

            // Generar código de 6 dígitos
            var codigo = new Random().Next(100000, 999999).ToString();

            cliente.CodigoRecuperacion = codigo;
            cliente.ExpiracionCodigo = DateTime.Now.AddMinutes(5); 

            await _contexto.SaveChangesAsync();

            // AQUÍ: Deberías llamar a tu servicio de Email real.
            // Por ahora simulamos devolviéndolo (solo para pruebas)
            return Ok(new { mensaje = "Código enviado (Simulado) tiene una validez de 5 minutos", codigoDebug = codigo });
        }

        // RF-012: Restablecer Contraseña
        [HttpPost("restablecer")]
        public async Task<IActionResult> RestablecerContrasena([FromBody] DtoRestablecer datos)
        {
            var cliente = await _contexto.Clientes
                .FirstOrDefaultAsync(c => c.CorreoElectronico == datos.CorreoElectronico
                                       && c.CodigoRecuperacion == datos.CodigoVerificacion);

            if (cliente == null) return BadRequest("Código inválido o correo incorrecto.");

            if (cliente.ExpiracionCodigo < DateTime.Now) return BadRequest("El código ha expirado.");

            // Actualizar contraseña
            cliente.ContrasenaHash = BCrypt.Net.BCrypt.HashPassword(datos.NuevaContrasena);

            // Limpiar código usado
            cliente.CodigoRecuperacion = null;
            cliente.ExpiracionCodigo = null;

            await _contexto.SaveChangesAsync();

            return Ok(new { mensaje = "Contraseña restablecida correctamente." });
        }

        private string GenerarTokenJwt(Cliente cliente)
        {
            var claims = new[]
            {
                new Claim("idCliente", cliente.IdCliente.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, cliente.CorreoElectronico),
                new Claim("cedula", cliente.Cedula), // <--- Agregamos cédula dentro del Token por seguridad
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var clave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuracion["ConfiguracionJwt:ClaveSecreta"]));
            var credenciales = new SigningCredentials(clave, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: credenciales
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

}
