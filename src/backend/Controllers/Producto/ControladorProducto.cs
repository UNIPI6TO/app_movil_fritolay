using backend.Datos;
using backend.Modelos.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers.Producto
{
    [Route("api/[controller]")]
    [ApiController]
    public class ControladorProductos :  ControllerBase
    {
        private readonly ContextoBaseDatos _contexto;

        public ControladorProductos(ContextoBaseDatos contexto)
        {
            _contexto = contexto;
        }

        // GET: api/productos
        // RF-003: Listado Multimedia de Productos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DtoProductoVisualizar>>> ObtenerCatalogo()
        {
            // 1. Consultar BD incluyendo las imágenes relacionadas
            var listaProductos = await _contexto.Productos
                .Include(p => p.Imagenes)
                .Where(p => p.Activo == true) // Solo productos activos
                .AsNoTracking() // Optimización de lectura
                .ToListAsync();

            // 2. Transformar Entidad a DTO (Data Transfer Object)
            var listaDto = listaProductos.Select(p =>
            {
                // Lógica de visualización de precio (informativo para la lista)
                decimal descuento = p.PrecioBase * (p.PorcentajeDescuento / 100m);
                decimal baseImponible = p.PrecioBase - descuento;
                decimal impuesto = baseImponible * (p.PorcentajeImpuesto / 100m);
                decimal precioFinal = baseImponible + impuesto;

                return new DtoProductoVisualizar
                {
                    IdProducto = p.IdProducto,
                    Nombre = p.Nombre,
                    Descripcion = p.Descripcion,
                    PrecioFinal = Math.Round(precioFinal, 2), // Redondeo a 2 decimales
                    // Convertimos la lista de objetos Imagen a una lista simple de Strings (URLs)
                    ImagenesUrl = p.Imagenes
                                    .OrderBy(img => img.IdImagen) // Ordenar si es necesario
                                    .Select(img => img.UrlImagen)
                                    .Take(3) // Asegurar máximo 3 imágenes
                                    .ToList()
                };
            }).ToList();

            return Ok(listaDto);
        }

        // GET: api/productos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DtoProductoVisualizar>> ObtenerDetalle(int id)
        {
            var producto = await _contexto.Productos
                .Include(p => p.Imagenes)
                .FirstOrDefaultAsync(p => p.IdProducto == id);

            if (producto == null)
            {
                return NotFound(new { mensaje = "Producto no encontrado" });
            }

            // Mapeo manual (podrías usar AutoMapper en el futuro)
            decimal descuento = producto.PrecioBase * (producto.PorcentajeDescuento / 100m);
            decimal baseImponible = producto.PrecioBase - descuento;
            decimal impuesto = baseImponible * (producto.PorcentajeImpuesto / 100m);

            var dto = new DtoProductoVisualizar
            {
                IdProducto = producto.IdProducto,
                Nombre = producto.Nombre,
                Descripcion = producto.Descripcion,
                PrecioFinal = Math.Round(baseImponible + impuesto, 2),
                ImagenesUrl = producto.Imagenes.Select(i => i.UrlImagen).ToList()
            };

            return Ok(dto);
        }
    }
}

