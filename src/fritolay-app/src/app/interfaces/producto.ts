export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  sku?: string;
  imagenes: string[]; // <--- ARRAY DE IMAGENES
  categoria: string;
}