namespace backend.Modelos.Dto
{
    public class DtoCrearPedido
    {
        // No pedimos IdCliente, lo sacamos del Token JWT por seguridad
        public string MetodoPago { get; set; }
        public string DireccionEntrega { get; set; }
        
        // Referencia de transferencia (opcional)
        public string ReferenciaTransferencia { get; set; }
        
        // Coordenadas GPS del lugar de entrega
        public decimal? LatitudEntrega { get; set; }
        public decimal? LongitudEntrega { get; set; }
        
        public List<DtoDetalleProducto> Productos { get; set; }
    }
}
