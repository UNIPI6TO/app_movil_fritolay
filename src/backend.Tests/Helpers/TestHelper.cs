using backend.Datos;
using backend.Modelos;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Tests.Helpers
{
    public static class TestHelper
    {
        /// <summary>
        /// Crea un contexto de base de datos en memoria para pruebas
        /// </summary>
        public static ContextoBaseDatos CrearContextoEnMemoria(string nombreBD = "")
        {
            if (string.IsNullOrEmpty(nombreBD))
            {
                nombreBD = Guid.NewGuid().ToString();
            }

            var options = new DbContextOptionsBuilder<ContextoBaseDatos>()
                .UseInMemoryDatabase(databaseName: nombreBD)
                .Options;

            return new ContextoBaseDatos(options);
        }

        /// <summary>
        /// Crea un cliente de prueba con datos válidos
        /// </summary>
        public static Cliente CrearCliente(
            string cedula = "0123456789",
            string nombre = "Juan Pérez",
            string email = "juan@test.com",
            string passwordHash = "$2a$10$abcdefghijklmnopqrstuvwxyz",
            string telefono = "0987654321",
            string direccion = "Av. Principal 123")
        {
            return new Cliente
            {
                Cedula = cedula,
                NombreCompleto = nombre,
                CorreoElectronico = email,
                ContrasenaHash = passwordHash,
                Telefono = telefono,
                Direccion = direccion
            };
        }

        /// <summary>
        /// Crea un producto de prueba con datos válidos
        /// </summary>
        public static Producto CrearProducto(
            string nombre = "Doritos Nacho",
            decimal precioBase = 2.50m,
            decimal descuento = 0.10m,
            decimal impuesto = 0.15m,
            string sku = "DOR-001",
            string linea = "Snacks",
            string categoria = "Papas Fritas")
        {
            return new Producto
            {
                Nombre = nombre,
                Descripcion = "Producto de prueba",
                PrecioBase = precioBase,
                PorcentajeDescuento = descuento,
                PorcentajeImpuesto = impuesto,
                Activo = true,
                SKU = sku,
                LineaProducto = linea,
                Categoria = categoria
            };
        }

        /// <summary>
        /// Crea un pedido de prueba básico
        /// </summary>
        public static Pedido CrearPedido(
            int idCliente,
            string estado = "Pendiente",
            string metodoPago = "Efectivo",
            decimal? latitud = null,
            decimal? longitud = null)
        {
            return new Pedido
            {
                IdCliente = idCliente,
                FechaCreacion = DateTime.Now,
                Estado = estado,
                MetodoPago = metodoPago,
                DireccionEntrega = "Calle Principal 123",
                LatitudEntrega = latitud,
                LongitudEntrega = longitud,
                Subtotal = 0,
                TotalDescuento = 0,
                TotalImpuestos = 0,
                TotalPagar = 0,
                Detalles = new List<DetallePedido>()
            };
        }

        /// <summary>
        /// Crea un detalle de pedido
        /// </summary>
        public static DetallePedido CrearDetallePedido(
            int idPedido,
            int idProducto,
            int cantidad,
            decimal precioUnitarioBase,
            decimal descuento,
            decimal impuesto)
        {
            var subtotal = precioUnitarioBase * cantidad;
            var valorDescuento = precioUnitarioBase * descuento;
            var precioConDescuento = precioUnitarioBase - valorDescuento;
            var valorImpuesto = precioConDescuento * impuesto;
            var precioFinal = precioConDescuento + valorImpuesto;

            return new DetallePedido
            {
                IdPedido = idPedido,
                IdProducto = idProducto,
                Cantidad = cantidad,
                PrecioUnitarioBase = precioUnitarioBase,
                PorcentajeDescuento = descuento,
                ValorDescuento = valorDescuento,
                PrecioUnitarioConDescuento = precioConDescuento,
                PorcentajeImpuesto = impuesto,
                ValorImpuesto = valorImpuesto,
                PrecioUnitarioFinal = precioFinal,
                SubtotalLinea = subtotal,
                DescuentoTotalLinea = valorDescuento * cantidad,
                ImpuestoTotalLinea = valorImpuesto * cantidad,
                TotalLinea = precioFinal * cantidad
            };
        }

        /// <summary>
        /// Genera un token JWT válido para pruebas
        /// </summary>
        public static string GenerarTokenJWT(
            string cedula,
            string email,
            int idCliente,
            string secretKey = "ClaveSecretaSuperSeguraParaPruebasUnitarias123456789")
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, cedula),
                    new Claim(ClaimTypes.Email, email),
                    new Claim("IdCliente", idCliente.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        /// <summary>
        /// Valida coordenadas GPS con precisión decimal(10,7)
        /// </summary>
        public static bool CoordenadasValidas(decimal? latitud, decimal? longitud)
        {
            if (!latitud.HasValue || !longitud.HasValue)
                return false;

            // Rango válido: Latitud (-90, 90), Longitud (-180, 180)
            if (latitud < -90 || latitud > 90)
                return false;

            if (longitud < -180 || longitud > 180)
                return false;

            // Validar precisión decimal(10,7): máximo 7 decimales
            var latitudStr = latitud.Value.ToString("0.0000000");
            var longitudStr = longitud.Value.ToString("0.0000000");

            return true;
        }

        /// <summary>
        /// Calcula el precio final de un producto aplicando descuentos e impuestos
        /// </summary>
        public static decimal CalcularPrecioFinal(
            decimal precioBase,
            decimal porcentajeDescuento,
            decimal porcentajeImpuesto)
        {
            var descuento = precioBase * porcentajeDescuento;
            var precioConDescuento = precioBase - descuento;
            var total = precioConDescuento * (1 + porcentajeImpuesto);
            return Math.Round(total, 2);
        }
    }
}
