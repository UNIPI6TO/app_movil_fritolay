namespace backend.Modelos.Dto
{
    public class DtoProductoVisualizar
    {
        public int IdProducto { get; set; }
        public string Nombre { get; set; }
        public string SKU { get; set; }
        public string Descripcion { get; set; }
        public decimal PrecioFinal { get; set; } // Calculado
        public List<string> ImagenesUrl { get; set; } // Lista simple de strings para el carrusel
    }
}
