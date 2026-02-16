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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuración adicional si es necesaria
            // Por ejemplo, asegurar que el borrado de un pedido borre sus detalles (Cascada)
            modelBuilder.Entity<Pedido>()
                .HasMany(p => p.Detalles)
                .WithOne(d => d.Pedido)
                .HasForeignKey(d => d.IdPedido)
                .OnDelete(DeleteBehavior.Cascade);
        }

    }
}
