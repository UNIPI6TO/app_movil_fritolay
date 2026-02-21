import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth';
import { CarritoService } from 'src/app/services/carrito'; 
import { ProductoService } from 'src/app/services/producto';
import { CarritoModalPage } from '../carrito-modal/carrito-modal.page';
import { ProductoDetallePage } from '../producto-detalle/producto-detalle.page';
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
  loading = true;

  constructor(
    private prodService: ProductoService,
    private cartService: CarritoService,
    private auth: AuthService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.prodService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener productos', err);
        this.productos = [];
        this.loading = false;
      }
    });
    this.cartService.carrito$.subscribe(() => {
      this.cantidadItems = this.cartService.getCantidadItemsUnicos();
    });
  }

  agregar(prod: Producto) {
    this.cartService.agregarProducto(prod);
  }

  verDetalle(prod: Producto) {
    (async () => {
      const modal = await this.modalCtrl.create({ component: ProductoDetallePage, componentProps: { producto: prod } });
      await modal.present();
      const { data } = await modal.onDidDismiss();
      if (data?.action === 'agregar') {
        this.agregar(prod);
      }
    })();
  }

  async verCarrito() {
    const modal = await this.modalCtrl.create({ component: CarritoModalPage });
    await modal.present();
  }

  logout() {
    this.auth.logout();
  }
}