import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth';
import { CarritoService } from 'src/app/services/carrito'; 
import { ProductoService } from 'src/app/services/producto';
import { CarritoModalPage } from '../carrito-modal/carrito-modal.page';
import { Producto } from '../../interfaces/producto';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: false
})
export class CatalogoPage implements OnInit {
  productos: Producto[] = [];
  cantidadItems = 0;

  constructor(
    private prodService: ProductoService,
    private cartService: CarritoService,
    private auth: AuthService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.productos = this.prodService.getProductos();
    this.cartService.carrito$.subscribe(() => {
      this.cantidadItems = this.cartService.getCantidadItems();
    });
  }

  agregar(prod: Producto) {
    this.cartService.agregarProducto(prod);
  }

  async verCarrito() {
    const modal = await this.modalCtrl.create({ component: CarritoModalPage });
    await modal.present();
  }

  logout() {
    this.auth.logout();
  }
}