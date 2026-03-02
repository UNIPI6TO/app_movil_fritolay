using backend.Modelos;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
namespace backend.Datos

{
  
    public class ContextoBaseDatos : DbContext
    {
        public ContextoBaseDatos(DbContextOptions<ContextoBaseDatos> options) : base(options)
        {

        }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<ImagenProducto> ImagenesProducto { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<DetallePedido> DetallesPedido { get; set; }
        public DbSet<PagoPedido> PagosPedido { get; set; }
        public DbSet<EntregaPedido> EntregasPedido { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuración de relaciones de borrado en cascada

            // Detalles de Pedido
            modelBuilder.Entity<Pedido>()
                .HasMany(p => p.Detalles)
                .WithOne(d => d.Pedido)
                .HasForeignKey(d => d.IdPedido)
                .OnDelete(DeleteBehavior.Cascade);

            // Pagos de Pedido
            modelBuilder.Entity<Pedido>()
                .HasMany(p => p.Pagos)
                .WithOne(pago => pago.Pedido)
                .HasForeignKey(pago => pago.IdPedido)
                .OnDelete(DeleteBehavior.Cascade);

            // Entregas de Pedido
            modelBuilder.Entity<Pedido>()
                .HasMany(p => p.Entregas)
                .WithOne(entrega => entrega.Pedido)
                .HasForeignKey(entrega => entrega.IdPedido)
                .OnDelete(DeleteBehavior.Cascade);
        }

    }
}
