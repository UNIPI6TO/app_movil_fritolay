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

  eliminarProducto(producto: Producto) {
    const index = this.items.findIndex(i => i.producto.id === producto.id);
    if (index >= 0) {
      this.items.splice(index, 1);
      this.guardarStorage();
    }
  }

  getTotal() {
    return this.items.reduce((acc, item) => {
      // Si precioFinal está disponible, usarlo; si no, calcular
      if (item.producto.precioFinal && item.producto.precioFinal > 0) {
        return acc + (item.producto.precioFinal * item.cantidad);
      }
      // Fallback: calcular manualmente si precioFinal no está disponible
      const precioBase = item.producto.precioBase || 0;
      const descuentoPercent = item.producto.descuentoPercent || 0;
      const ivaPercent = item.producto.ivaPercent || 0;
      
      const descuentoAmount = (descuentoPercent / 100) * precioBase;
      const precioConDescuento = Math.max(0, precioBase - descuentoAmount);
      const ivaAmount = precioConDescuento * (ivaPercent / 100);
      const precioFinal = precioConDescuento + ivaAmount;
      
      return acc + (precioFinal * item.cantidad);
    }, 0);
  }

  getPrecioItemConDescuento(item: { producto: Producto, cantidad: number }): number {
    // Si precioFinal está disponible, usarlo
    if (item.producto.precioFinal && item.producto.precioFinal > 0) {
      return item.producto.precioFinal * item.cantidad;
    }
    // Fallback: calcular manualmente
    const precioBase = item.producto.precioBase || 0;
    const descuentoPercent = item.producto.descuentoPercent || 0;
    const ivaPercent = item.producto.ivaPercent || 0;
    
    const descuentoAmount = (descuentoPercent / 100) * precioBase;
    const precioConDescuento = Math.max(0, precioBase - descuentoAmount);
    const ivaAmount = precioConDescuento * (ivaPercent / 100);
    const precioFinal = precioConDescuento + ivaAmount;
    
    return precioFinal * item.cantidad;
  }

  getDescuentoItem(item: { producto: Producto, cantidad: number }): number {
    const precioBase = item.producto.precioBase || 0;
    const descuentoPercent = item.producto.descuentoPercent || 0;
    const descuentoAmount = (descuentoPercent / 100) * precioBase;
    return descuentoAmount * item.cantidad;
  }

  getPrecioBaseItem(item: { producto: Producto, cantidad: number }): number {
    const precioBase = item.producto.precioBase || 0;
    return precioBase * item.cantidad;
  }

  getCantidadItems() {
    return this.items.reduce((acc, item) => acc + item.cantidad, 0);
  }
    getCantidadItemsUnicos() {
    return this.items.length;
  }


}