export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precioBase: number; // Precio original sin descuento
  precioFinal: number; // Precio final con descuento e impuesto
  sku?: string;
  imagenes: string[];
  categoria: string;
  linea?: string;
  descuentoPercent: number; // Porcentaje de descuento (ej: 10 = 10%)
  ivaPercent: number; // Porcentaje de IVA (ej: 12 = 12%)
}