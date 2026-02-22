namespace backend.Modelos.Dto
{
    public class DtoProductoVisualizar
    {
        public int IdProducto { get; set; }
        public string Nombre { get; set; }
        public string SKU { get; set; }
        public string Descripcion { get; set; }
        public decimal PrecioBase { get; set; } // Precio original
        public decimal PrecioFinal { get; set; } // Calculado
        public decimal PorcentajeDescuento { get; set; } // Porcentaje de descuento
        public decimal PorcentajeImpuesto { get; set; } // Porcentaje de impuesto (IVA)
        public List<string> ImagenesUrl { get; set; } // Lista simple de strings para el carrusel
        public string LineaProducto { get; set; }
        public string Categoria { get; set; }
    }
}