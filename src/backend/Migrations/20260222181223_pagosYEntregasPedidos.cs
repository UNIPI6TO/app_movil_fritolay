using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class pagosYEntregasPedidos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImpuestoCobrado",
                table: "DetallesPedido",
                newName: "ValorImpuesto");

            migrationBuilder.AddColumn<decimal>(
                name: "CantidadEntregada",
                table: "Pedidos",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaConfirmacionPago",
                table: "Pedidos",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaEntrega",
                table: "Pedidos",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MontoTotalPagado",
                table: "Pedidos",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalDescuento",
                table: "Pedidos",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "DescuentoTotalLinea",
                table: "DetallesPedido",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "ImpuestoTotalLinea",
                table: "DetallesPedido",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "PorcentajeDescuento",
                table: "DetallesPedido",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "PorcentajeImpuesto",
                table: "DetallesPedido",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "PrecioUnitarioBase",
                table: "DetallesPedido",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "PrecioUnitarioConDescuento",
                table: "DetallesPedido",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "SubtotalLinea",
                table: "DetallesPedido",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "ValorDescuento",
                table: "DetallesPedido",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "EntregasPedido",
                columns: table => new
                {
                    IdEntrega = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdPedido = table.Column<int>(type: "int", nullable: false),
                    CantidadEntregada = table.Column<int>(type: "int", nullable: false),
                    FechaEntrega = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Estado = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Observaciones = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReferenciaSeguimiento = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LatitudEntrega = table.Column<decimal>(type: "decimal(18,8)", nullable: true),
                    LongitudEntrega = table.Column<decimal>(type: "decimal(18,8)", nullable: true),
                    DireccionEntregaReal = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EntregasPedido", x => x.IdEntrega);
                    table.ForeignKey(
                        name: "FK_EntregasPedido_Pedidos_IdPedido",
                        column: x => x.IdPedido,
                        principalTable: "Pedidos",
                        principalColumn: "IdPedido",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PagosPedido",
                columns: table => new
                {
                    IdPago = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IdPedido = table.Column<int>(type: "int", nullable: false),
                    MontoPagado = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    FechaPago = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MetodoPagoUtilizado = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReferenciaPago = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Observaciones = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PagosPedido", x => x.IdPago);
                    table.ForeignKey(
                        name: "FK_PagosPedido_Pedidos_IdPedido",
                        column: x => x.IdPedido,
                        principalTable: "Pedidos",
                        principalColumn: "IdPedido",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EntregasPedido_IdPedido",
                table: "EntregasPedido",
                column: "IdPedido");

            migrationBuilder.CreateIndex(
                name: "IX_PagosPedido_IdPedido",
                table: "PagosPedido",
                column: "IdPedido");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EntregasPedido");

            migrationBuilder.DropTable(
                name: "PagosPedido");

            migrationBuilder.DropColumn(
                name: "CantidadEntregada",
                table: "Pedidos");

            migrationBuilder.DropColumn(
                name: "FechaConfirmacionPago",
                table: "Pedidos");

            migrationBuilder.DropColumn(
                name: "FechaEntrega",
                table: "Pedidos");

            migrationBuilder.DropColumn(
                name: "MontoTotalPagado",
                table: "Pedidos");

            migrationBuilder.DropColumn(
                name: "TotalDescuento",
                table: "Pedidos");

            migrationBuilder.DropColumn(
                name: "DescuentoTotalLinea",
                table: "DetallesPedido");

            migrationBuilder.DropColumn(
                name: "ImpuestoTotalLinea",
                table: "DetallesPedido");

            migrationBuilder.DropColumn(
                name: "PorcentajeDescuento",
                table: "DetallesPedido");

            migrationBuilder.DropColumn(
                name: "PorcentajeImpuesto",
                table: "DetallesPedido");

            migrationBuilder.DropColumn(
                name: "PrecioUnitarioBase",
                table: "DetallesPedido");

            migrationBuilder.DropColumn(
                name: "PrecioUnitarioConDescuento",
                table: "DetallesPedido");

            migrationBuilder.DropColumn(
                name: "SubtotalLinea",
                table: "DetallesPedido");

            migrationBuilder.DropColumn(
                name: "ValorDescuento",
                table: "DetallesPedido");

            migrationBuilder.RenameColumn(
                name: "ValorImpuesto",
                table: "DetallesPedido",
                newName: "ImpuestoCobrado");
        }
    }
}
