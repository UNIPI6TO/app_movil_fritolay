import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatalogoPageRoutingModule } from './catalogo-routing.module';
import { CatalogoPage } from './catalogo.page';
import { ProductoDetallePageModule } from '../producto-detalle/producto-detalle.module';
import { CarritoModalPageModule } from '../carrito-modal/carrito-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatalogoPageRoutingModule,
    ProductoDetallePageModule,
    CarritoModalPageModule
  ],
  declarations: [CatalogoPage]
})
export class CatalogoPageModule {}
