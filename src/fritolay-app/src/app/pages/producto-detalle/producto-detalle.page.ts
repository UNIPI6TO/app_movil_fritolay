import { Component, Input } from '@angular/core';
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

  constructor(private modalCtrl: ModalController) { }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  agregarYcerrar() {
    this.modalCtrl.dismiss({ action: 'agregar', producto: this.producto });
  }
}
