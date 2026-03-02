namespace backend.Modelos.Dto
{
    public class DtoRegistroEntrega
    {
        public int IdPedido { get; set; }
        public int CantidadEntregada { get; set; }
        public string Estado { get; set; } // "Entregado", "Parcial", "Fallida"
        public string Observaciones { get; set; } // Nombre de quien recibió, etc.
        public string ReferenciaSeguimiento { get; set; } // Número de guía, referencia de courier
        
        // COORDENADAS GPS
        public decimal? LatitudEntrega { get; set; } // Latitud de la ubicación de entrega
        public decimal? LongitudEntrega { get; set; } // Longitud de la ubicación de entrega
        public string DireccionEntregaReal { get; set; } // Dirección exacta donde se entregó
    }

    public class DtoRegistrosEntregasMultiples
    {
        public List<DtoRegistroEntrega> Entregas { get; set; }
    }
}
