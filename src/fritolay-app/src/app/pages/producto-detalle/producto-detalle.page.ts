import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CarritoService } from 'src/app/services/carrito';
import { ModalController } from '@ionic/angular';
import { Producto } from '../../interfaces/producto';

@Component({
  selector: 'app-producto-detalle',
  templateUrl: './producto-detalle.page.html',
  styleUrls: ['./producto-detalle.page.scss'],
  standalone: false,
})
export class ProductoDetallePage {
  @Input() producto!: Producto;

  cantidad = 0;
  private destroy$ = new Subject<void>();
  selectedImageIndex = 0;

  // Cálculos reactivos (por unidad y totales)
  get unitPrecioBase(): number {
    return this.producto?.precioBase ?? 0;
  }

  get unitPrecioFinal(): number {
    return this.producto?.precioFinal ?? 0;
  }

  get descuentoPercent(): number {
    return this.producto?.descuentoPercent ?? 0;
  }

  get ivaPercent(): number {
    return this.producto?.ivaPercent ?? 0;
  }

  get unitDescuentoAmount(): number {
    return (this.descuentoPercent / 100) * this.unitPrecioBase;
  }

  get unitPrecioConDescuento(): number {
    return Math.max(0, this.unitPrecioBase - this.unitDescuentoAmount);
  }

  get unitIva(): number {
    return this.unitPrecioConDescuento * (this.ivaPercent / 100);
  }

  get cantidadEffective(): number {
    return this.cantidad > 0 ? this.cantidad : 1;
  }

  get subtotal(): number {
    return this.unitPrecioBase * this.cantidadEffective;
  }

  get descuentoTotal(): number {
    return this.unitDescuentoAmount * this.cantidadEffective;
  }

  get ivaTotal(): number {
    return this.unitIva * this.cantidadEffective;
  }

  get total(): number {
    return this.unitPrecioFinal * this.cantidadEffective;
  }

  constructor(private modalCtrl: ModalController, private cartService: CarritoService) { }

  ngOnInit(): void {
    this.cartService.carrito$.pipe(takeUntil(this.destroy$)).subscribe(items => {
      const found = Array.isArray(items) ? items.find(i => String(i.producto.id) === String(this.producto.id)) : undefined;
      this.cantidad = found ? found.cantidad : 0;
    });
    this.selectedImageIndex = 0;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  agregarYcerrar() {
    this.modalCtrl.dismiss({ action: 'agregar', producto: this.producto });
  }

  aumentar() {
    this.cartService.agregarProducto(this.producto);
  }

  reducir() {
    this.cartService.disminuirProducto(this.producto);
  }

  borrar() {
    this.cartService.eliminarProducto(this.producto);
  }

  agregarSolo() {
    this.cartService.agregarProducto(this.producto);
  }

  selectImage(index: number) {
    if (!this.producto || !this.producto.imagenes) return;
    if (index >= 0 && index < this.producto.imagenes.length) {
      this.selectedImageIndex = index;
    }
  }

  cambiarCantidad(nuevaCantidad: string | null | undefined) {
    if (!nuevaCantidad) return;
    const cantidad = parseInt(nuevaCantidad, 10);
    
    if (isNaN(cantidad) || cantidad < 0) {
      return;
    }
    
    if (cantidad === 0) {
      this.cartService.eliminarProducto(this.producto);
    } else if (cantidad > this.cantidad) {
      const diferencia = cantidad - this.cantidad;
      for (let i = 0; i < diferencia; i++) {
        this.cartService.agregarProducto(this.producto);
      }
    } else if (cantidad < this.cantidad) {
      const diferencia = this.cantidad - cantidad;
      for (let i = 0; i < diferencia; i++) {
        this.cartService.disminuirProducto(this.producto);
      }
    }
  }
}

