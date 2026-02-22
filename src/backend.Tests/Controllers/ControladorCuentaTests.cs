using backend.Controllers.Usuario;
using backend.Datos;
using backend.Modelos;
using backend.Modelos.Dto;
using backend.Tests.Helpers;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace backend.Tests.Controllers
{
    /// <summary>
    /// TC-BE-001 a TC-BE-012: Pruebas de Autenticación
    /// </summary>
    [Trait("Category", "Integration")]
    public class ControladorCuentaTests
    {
        private readonly IConfiguration _configuracion;

        public ControladorCuentaTests()
        {
            // Configuración de prueba con clave JWT
            var inMemorySettings = new Dictionary<string, string>
            {
                {"ConfiguracionJwt:ClaveSecreta", "ClaveSecretaSuperSeguraParaPruebasUnitarias123456789"}
            };

            _configuracion = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings!)
                .Build();
        }

        // TC-BE-001: Registro de Usuario Exitoso
        [Fact]
        public async Task Registrar_DatosValidos_RegistraUsuarioYDevuelveOk()
        {
            // Arrange
            using var contexto = TestHelper.CrearContextoEnMemoria();
            var controlador = new ControladorCuenta(contexto, _configuracion);

            var datosRegistro = new DtoRegistro
            {
                Cedula = "0123456789",
                NombreCompleto = "Juan Pérez",
                CorreoElectronico = "juan@test.com",
                Contrasena = "Password123!",
                Telefono = "0987654321",
                Direccion = "Av. Principal 123"
            };

            // Act
            var resultado = await controlador.Registrar(datosRegistro);

            // Assert
            resultado.Should().BeOfType<OkObjectResult>();
            var okResult = resultado as OkObjectResult;
            okResult!.Value.Should().NotBeNull();

            var clienteCreado = await contexto.Clientes
                .FirstOrDefaultAsync(c => c.Cedula == datosRegistro.Cedula);
            clienteCreado.Should().NotBeNull();
            clienteCreado!.NombreCompleto.Should().Be(datosRegistro.NombreCompleto);
            clienteCreado.CorreoElectronico.Should().Be(datosRegistro.CorreoElectronico);
        }

        // TC-BE-002: Validación de Cédula Única
        [Fact]
        public async Task Registrar_CedulaDuplicada_DevuelveBadRequest()
        {
            // Arrange
            using var contexto = TestHelper.CrearContextoEnMemoria();
            var controlador = new ControladorCuenta(contexto, _configuracion);

            var clienteExistente = TestHelper.CrearCliente(cedula: "0123456789");
            contexto.Clientes.Add(clienteExistente);
            await contexto.SaveChangesAsync();

            var datosRegistro = new DtoRegistro
            {
                Cedula = "0123456789", // Cédula duplicada
                NombreCompleto = "María López",
                CorreoElectronico = "maria@test.com",
                Contrasena = "Password123!",
                Telefono = "0999999999"
            };

            // Act
            var resultado = await controlador.Registrar(datosRegistro);

            // Assert
            resultado.Should().BeOfType<BadRequestObjectResult>();
        }

        // TC-BE-003: Validación de Email Único
        [Fact]
        public async Task Registrar_EmailDuplicado_DevuelveBadRequest()
        {
            // Arrange
            using var contexto = TestHelper.CrearContextoEnMemoria();
            var controlador = new ControladorCuenta(contexto, _configuracion);

            var clienteExistente = TestHelper.CrearCliente(email: "juan@test.com");
            contexto.Clientes.Add(clienteExistente);
            await contexto.SaveChangesAsync();

            var datosRegistro = new DtoRegistro
            {
                Cedula = "9876543210", // Cédula diferente
                NombreCompleto = "María López",
                CorreoElectronico = "juan@test.com", // Email duplicado
                Contrasena = "Password123!",
                Telefono = "0999999999"
            };

            // Act
            var resultado = await controlador.Registrar(datosRegistro);

            // Assert
            resultado.Should().BeOfType<BadRequestObjectResult>();
        }

        // TC-BE-004: Contraseña Hasheada con BCrypt
        [Fact]
        public async Task Registrar_ContrasenaGuardada_EstaHasheadaConBCrypt()
        {
            // Arrange
            using var contexto = TestHelper.CrearContextoEnMemoria();
            var controlador = new ControladorCuenta(contexto, _configuracion);

            var datosRegistro = new DtoRegistro
            {
                Cedula = "0123456789",
                NombreCompleto = "Juan Pérez",
                CorreoElectronico = "juan@test.com",
                Contrasena = "Password123!",
                Telefono = "0987654321",
                Direccion = "Av. Principal 123"
            };

            // Act
            await controlador.Registrar(datosRegistro);

            // Assert
            var cliente = await contexto.Clientes.FirstAsync();
            cliente.ContrasenaHash.Should().NotBe("Password123!");
            cliente.ContrasenaHash.Should().StartWith("$2a$"); // Formato BCrypt
            BCrypt.Net.BCrypt.Verify("Password123!", cliente.ContrasenaHash).Should().BeTrue();
        }

        // TC-BE-005: Login Exitoso
        [Fact]
        public async Task IniciarSesion_CredencialesValidas_DevuelveTokenYDatosUsuario()
        {
            // Arrange
            using var contexto = TestHelper.CrearContextoEnMemoria();
            var controlador = new ControladorCuenta(contexto, _configuracion);

            var passwordHash = BCrypt.Net.BCrypt.HashPassword("Password123!");
            var cliente = TestHelper.CrearCliente(
                cedula: "0123456789",
                email: "juan@test.com",
                passwordHash: passwordHash);
            contexto.Clientes.Add(cliente);
            await contexto.SaveChangesAsync();

            var datosLogin = new DtoLogin
            {
                CorreoElectronico = "juan@test.com",
                Contrasena = "Password123!"
            };

            // Act
            var resultado = await controlador.IniciarSesion(datosLogin);

            // Assert
            resultado.Should().BeOfType<OkObjectResult>();
            var okResult = resultado as OkObjectResult;
            var response = okResult!.Value;

            response.Should().NotBeNull();
            response!.GetType().GetProperty("tokenAcceso")!.GetValue(response).Should().NotBeNull();
            response.GetType().GetProperty("idUsuario")!.GetValue(response).Should().Be(cliente.IdCliente);
            response.GetType().GetProperty("cedula")!.GetValue(response).Should().Be("0123456789");
        }

        // TC-BE-006: Login con Credenciales Incorrectas
        [Fact]
        public async Task IniciarSesion_CredencialesIncorrectas_DevuelveUnauthorized()
        {
            // Arrange
            using var contexto = TestHelper.CrearContextoEnMemoria();
            var controlador = new ControladorCuenta(contexto, _configuracion);

            var passwordHash = BCrypt.Net.BCrypt.HashPassword("Password123!");
            var cliente = TestHelper.CrearCliente(
                email: "juan@test.com",
                passwordHash: passwordHash);
            contexto.Clientes.Add(cliente);
            await contexto.SaveChangesAsync();

            var datosLogin = new DtoLogin
            {
                CorreoElectronico = "juan@test.com",
                Contrasena = "PasswordIncorrecta!" // Contraseña incorrecta
            };

            // Act
            var resultado = await controlador.IniciarSesion(datosLogin);

            // Assert
            resultado.Should().BeOfType<UnauthorizedObjectResult>();
        }

        // TC-BE-007: Login - Usuario No Existe
        [Fact]
        public async Task IniciarSesion_UsuarioNoExiste_DevuelveUnauthorized()
        {
            // Arrange
            using var contexto = TestHelper.CrearContextoEnMemoria();
            var controlador = new ControladorCuenta(contexto, _configuracion);

            var datosLogin = new DtoLogin
            {
                CorreoElectronico = "noexiste@test.com",
                Contrasena = "Password123!"
            };

            // Act
            var resultado = await controlador.IniciarSesion(datosLogin);

            // Assert
            resultado.Should().BeOfType<UnauthorizedObjectResult>();
        }

        // TC-BE-008: Token JWT Incluye Claims de Cédula
        [Fact]
        public async Task IniciarSesion_TokenGenerado_IncluyeClaimsDeCedulaYEmail()
        {
            // Arrange
            using var contexto = TestHelper.CrearContextoEnMemoria();
            var controlador = new ControladorCuenta(contexto, _configuracion);

            var passwordHash = BCrypt.Net.BCrypt.HashPassword("Password123!");
            var cliente = TestHelper.CrearCliente(
                cedula: "0123456789",
                email: "juan@test.com",
                passwordHash: passwordHash);
            contexto.Clientes.Add(cliente);
            await contexto.SaveChangesAsync();

            var datosLogin = new DtoLogin
            {
                CorreoElectronico = "juan@test.com",
                Contrasena = "Password123!"
            };

            // Act
            var resultado = await controlador.IniciarSesion(datosLogin);

            // Assert
            resultado.Should().BeOfType<OkObjectResult>();
            var okResult = resultado as OkObjectResult;
            var response = okResult!.Value;
            var token = response!.GetType().GetProperty("tokenAcceso")!.GetValue(response) as string;

            token.Should().NotBeNullOrEmpty();

            // Decodificar token y validar claims
            var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            jwtToken.Claims.Should().Contain(c => c.Type == "cedula" && c.Value == "0123456789");
            jwtToken.Claims.Should().Contain(c => c.Type == "email" && c.Value == "juan@test.com");
            jwtToken.Claims.Should().Contain(c => c.Type == "idCliente");
        }

        // TC-BE-009: Token JWT Tiene Expiración de 7 Días
        [Fact]
        public async Task IniciarSesion_TokenGenerado_ExpiraEn7Dias()
        {
            // Arrange
            using var contexto = TestHelper.CrearContextoEnMemoria();
            var controlador = new ControladorCuenta(contexto, _configuracion);

            var passwordHash = BCrypt.Net.BCrypt.HashPassword("Password123!");
            var cliente = TestHelper.CrearCliente(email: "juan@test.com", passwordHash: passwordHash);
            contexto.Clientes.Add(cliente);
            await contexto.SaveChangesAsync();

            var datosLogin = new DtoLogin
            {
                CorreoElectronico = "juan@test.com",
                Contrasena = "Password123!"
            };

            // Act
            var resultado = await controlador.IniciarSesion(datosLogin);

            // Assert
            var okResult = resultado as OkObjectResult;
            var response = okResult!.Value;
            var token = response!.GetType().GetProperty("tokenAcceso")!.GetValue(response) as string;

            var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
            var jwtToken = handler.ReadJwtToken(token);

            var expiracion = jwtToken.ValidTo;
            var ahora = DateTime.UtcNow;

            var diferencia = expiracion - ahora;
            diferencia.TotalDays.Should().BeApproximately(7, 0.1);
        }

        // TC-BE-010: Solicitar Recuperación - Email Válido
        [Fact]
        public async Task SolicitarRecuperacion_EmailValido_GeneraCodigoYDevuelveOk()
        {
            // Arrange
            using var contexto = TestHelper.CrearContextoEnMemoria();
            var controlador = new ControladorCuenta(contexto, _configuracion);

            var cliente = TestHelper.CrearCliente(email: "juan@test.com");
            contexto.Clientes.Add(cliente);
            await contexto.SaveChangesAsync();

            var solicitud = new DtoRecuperar
            {
                CorreoElectronico = "juan@test.com"
            };

            // Act
            var resultado = await controlador.SolicitarRecuperacion(solicitud);

            // Assert
            resultado.Should().BeOfType<OkObjectResult>();

            var clienteActualizado = await contexto.Clientes.FirstAsync();
            clienteActualizado.CodigoRecuperacion.Should().NotBeNullOrEmpty();
            clienteActualizado.CodigoRecuperacion!.Length.Should().Be(6);
            clienteActualizado.ExpiracionCodigo.Should().NotBeNull();
            clienteActualizado.ExpiracionCodigo!.Value.Should().BeAfter(DateTime.Now);
        }

        // TC-BE-011: Solicitar Recuperación - Email No Existe
        [Fact]
        public async Task SolicitarRecuperacion_EmailNoExiste_DevuelveNotFound()
        {
            // Arrange
            using var contexto = TestHelper.CrearContextoEnMemoria();
            var controlador = new ControladorCuenta(contexto, _configuracion);

            var solicitud = new DtoRecuperar
            {
                CorreoElectronico = "noexiste@test.com"
            };

            // Act
            var resultado = await controlador.SolicitarRecuperacion(solicitud);

            // Assert
            resultado.Should().BeOfType<NotFoundObjectResult>();
        }

        // TC-BE-012: Restablecer Contraseña - Código Válido
        [Fact]
        public async Task RestablecerContrasena_CodigoValido_ActualizaContrasenaYDevuelveOk()
        {
            // Arrange
            using var contexto = TestHelper.CrearContextoEnMemoria();
            var controlador = new ControladorCuenta(contexto, _configuracion);

            var cliente = TestHelper.CrearCliente(email: "juan@test.com");
            cliente.CodigoRecuperacion = "123456";
            cliente.ExpiracionCodigo = DateTime.Now.AddMinutes(5);
            contexto.Clientes.Add(cliente);
            await contexto.SaveChangesAsync();

            var solicitud = new DtoRestablecer
            {
                CorreoElectronico = "juan@test.com",
                CodigoVerificacion = "123456",
                NuevaContrasena = "NuevaPassword123!"
            };

            // Act
            var resultado = await controlador.RestablecerContrasena(solicitud);

            // Assert
            resultado.Should().BeOfType<OkObjectResult>();

            var clienteActualizado = await contexto.Clientes.FirstAsync();
            BCrypt.Net.BCrypt.Verify("NuevaPassword123!", clienteActualizado.ContrasenaHash).Should().BeTrue();
            clienteActualizado.CodigoRecuperacion.Should().BeNull();
            clienteActualizado.ExpiracionCodigo.Should().BeNull();
        }

        // TC-BE-012 (parte 2): Restablecer Contraseña - Código Expirado
        [Fact]
        public async Task RestablecerContrasena_CodigoExpirado_DevuelveBadRequest()
        {
            // Arrange
            using var contexto = TestHelper.CrearContextoEnMemoria();
            var controlador = new ControladorCuenta(contexto, _configuracion);

            var cliente = TestHelper.CrearCliente(email: "juan@test.com");
            cliente.CodigoRecuperacion = "123456";
            cliente.ExpiracionCodigo = DateTime.Now.AddMinutes(-1); // Expirado
            contexto.Clientes.Add(cliente);
            await contexto.SaveChangesAsync();

            var solicitud = new DtoRestablecer
            {
                CorreoElectronico = "juan@test.com",
                CodigoVerificacion = "123456",
                NuevaContrasena = "NuevaPassword123!"
            };

            // Act
            var resultado = await controlador.RestablecerContrasena(solicitud);

            // Assert
            resultado.Should().BeOfType<BadRequestObjectResult>();
        }
    }
}
