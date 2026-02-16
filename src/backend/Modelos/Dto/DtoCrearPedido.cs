namespace backend.Modelos.Dto
{
    public class DtoCrearPedido
    {
        // No pedimos IdCliente, lo sacamos del Token JWT por seguridad
        public string MetodoPago { get; set; }
        public string DireccionEntrega { get; set; }
        public List<DtoDetalleProducto> Productos { get; set; }
    }
}
