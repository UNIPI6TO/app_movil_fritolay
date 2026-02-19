export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenes: string[]; // <--- ARRAY DE IMAGENES
  categoria: string;
}