import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { ItemCarrito } from '../interfaces/item-carrito';
import { Producto } from '../interfaces/producto';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  
  private items: ItemCarrito[] = [];
  private carrito = new BehaviorSubject<ItemCarrito[]>([]);
  carrito$ = this.carrito.asObservable();

  constructor() {
    this.cargarStorage();
  }

  // Cargar carrito guardado anteriormente
  async cargarStorage() {
    const { value } = await Preferences.get({ key: 'carrito_compras' });
    if (value) {
      this.items = JSON.parse(value);
      this.carrito.next(this.items);
    }
  }

  // Guardar cambios
  async guardarStorage() {
    await Preferences.set({ 
      key: 'carrito_compras', 
      value: JSON.stringify(this.items) 
    });
    this.carrito.next(this.items);
  }

  agregarProducto(producto: Producto) {
    const index = this.items.findIndex(i => i.producto.id === producto.id);
    if (index >= 0) {
      this.items[index].cantidad++;
    } else {
      this.items.push({ producto, cantidad: 1 });
    }
    this.guardarStorage();
  }

  disminuirProducto(producto: Producto) {
    const index = this.items.findIndex(i => i.producto.id === producto.id);
    if (index >= 0) {
      this.items[index].cantidad--;
      if (this.items[index].cantidad === 0) {
        this.items.splice(index, 1);
      }
      this.guardarStorage();
    }
  }

  getTotal() {
    return this.items.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
  }

  getCantidadItems() {
    return this.items.reduce((acc, item) => acc + item.cantidad, 0);
  }
}