import { Injectable } from '@angular/core';
import { Producto } from '../interfaces/producto';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  
  // Simulando DB con Array de imágenes
  private productos: Producto[] = [
    {
      id: 1,
      nombre: "Lay's Clásicas",
      descripcion: "Papas fritas corte clásico",
      precio: 1.50,
      categoria: "Papas",
      imagenes: [
        "https://i.imgur.com/N8AU8wA.jpeg", 
        "https://i.imgur.com/uNJlp6F.jpeg",
        "https://i.imgur.com/C0mlyxg.jpeg"
      ]
    },
    {
      id: 2,
      nombre: "Doritos Nacho",
      descripcion: "Tortillas sabor queso",
      precio: 1.80,
      categoria: "Tortillas",
      imagenes: [
        "https://i.imgur.com/example-doritos.png"
      ]
    }
  ];

  getProductos() {
    return this.productos;
  }
}