import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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

  constructor(private cartService: CarritoService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.cartService.carrito$.subscribe(datos => {
      this.items = datos;
      this.total = this.cartService.getTotal();
    });
  }

  cerrar() { this.modalCtrl.dismiss(); }
  mas(item: { producto: Producto, cantidad: number }) { this.cartService.agregarProducto(item.producto); }
  menos(item: { producto: Producto, cantidad: number }) { this.cartService.disminuirProducto(item.producto); }
}