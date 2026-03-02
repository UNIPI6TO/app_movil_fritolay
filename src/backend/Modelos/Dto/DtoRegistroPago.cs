namespace backend.Modelos.Dto
{
    public class DtoRegistroPago
    {
        public int IdPedido { get; set; }
        public decimal MontoPagado { get; set; }
        public string MetodoPagoUtilizado { get; set; } // "Efectivo", "Transferencia", "Tarjeta", etc.
        public string ReferenciaPago { get; set; } // Número de transacción, comprobante
        public string Observaciones { get; set; }
    }

    public class DtoRegistrosPagosMultiples
    {
        public List<DtoRegistroPago> Pagos { get; set; }
    }
}
