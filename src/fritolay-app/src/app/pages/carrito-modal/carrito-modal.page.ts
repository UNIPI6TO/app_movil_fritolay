import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CarritoService } from 'src/app/services/carrito';
import { Producto } from '../../interfaces/producto';

@Component({
  selector: 'app-carrito-modal',
  templateUrl: './carrito-modal.page.html',
  styleUrls: ['./carrito-modal.page.scss'],
  standalone: false,
})
export class CarritoModalPage implements OnInit {
  items: { producto: Producto, cantidad: number }[] = [];
  total = 0;

  constructor(private cartService: CarritoService, private modalCtrl: ModalController, private router: Router) { }

  ngOnInit() {
    this.cartService.carrito$.subscribe(datos => {
      this.items = datos;
      this.total = this.cartService.getTotal();
      console.log('Carrito actualizado. Total:', this.total, 'Items:', this.items);
    });
  }

  cerrar() { this.modalCtrl.dismiss(); }
  mas(item: { producto: Producto, cantidad: number }) { this.cartService.agregarProducto(item.producto); }
  menos(item: { producto: Producto, cantidad: number }) { this.cartService.disminuirProducto(item.producto); }

  getPrecioBase(producto: Producto): number {
    return producto.precioBase || 0;
  }

  getPrecioFinal(producto: Producto): number {
    return producto.precioFinal || 0;
  }

  getDescuentoPercent(producto: Producto): number {
    return producto.descuentoPercent || 0;
  }

  getIvaPercent(producto: Producto): number {
    return producto.ivaPercent || 0;
  }

  tieneDescuento(producto: Producto): boolean {
    return (producto.descuentoPercent || 0) > 0;
  }

  getSubtotal(item: { producto: Producto, cantidad: number }): number {
    return this.getPrecioBase(item.producto) * item.cantidad;
  }

  getDescuentoTotal(item: { producto: Producto, cantidad: number }): number {
    const precioBase = this.getPrecioBase(item.producto);
    const descuentoPercent = this.getDescuentoPercent(item.producto);
    const descuentoAmount = (descuentoPercent / 100) * precioBase;
    return descuentoAmount * item.cantidad;
  }

  getPrecioFinalTotal(item: { producto: Producto, cantidad: number }): number {
    return this.getPrecioFinal(item.producto) * item.cantidad;
  }

  getSubtotalCarrito(): number {
    return this.items.reduce((acc, item) => acc + this.getSubtotal(item), 0);
  }

  getTotalDescuentoCarrito(): number {
    return this.items.reduce((acc, item) => acc + this.getDescuentoTotal(item), 0);
  }

  getTotalIvaCarrito(): number {
    let ivaTotal = 0;
    this.items.forEach(item => {
      const precioBase = this.getPrecioBase(item.producto);
      const descuentoPercent = this.getDescuentoPercent(item.producto);
      const descuentoAmount = (descuentoPercent / 100) * precioBase;
      const precioConDescuento = Math.max(0, precioBase - descuentoAmount);
      const ivaPercent = item.producto.ivaPercent || 0;
      const ivaAmount = precioConDescuento * (ivaPercent / 100);
      ivaTotal += ivaAmount * item.cantidad;
    });
    return ivaTotal;
  }

  cambiarCantidadItem(item: any, nuevaCantidad: string | null | undefined) {
    if (!nuevaCantidad) return;
    const cantidad = parseInt(nuevaCantidad, 10);
    const cantidadActual = item.cantidad;
    
    if (isNaN(cantidad) || cantidad < 0) {
      return;
    }
    
    if (cantidad === 0) {
      this.cartService.eliminarProducto(item.producto);
    } else if (cantidad > cantidadActual) {
      const diferencia = cantidad - cantidadActual;
      for (let i = 0; i < diferencia; i++) {
        this.cartService.agregarProducto(item.producto);
      }
    } else if (cantidad < cantidadActual) {
      const diferencia = cantidadActual - cantidad;
      for (let i = 0; i < diferencia; i++) {
        this.cartService.disminuirProducto(item.producto);
      }
    }
  }

  irACheckout() {
    this.modalCtrl.dismiss();
    this.router.navigate(['/checkout']);
  }
}