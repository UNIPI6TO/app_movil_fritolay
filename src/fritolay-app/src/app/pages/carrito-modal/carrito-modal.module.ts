import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarritoModalPageRoutingModule } from './carrito-modal-routing.module';

import { CarritoModalPage } from './carrito-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarritoModalPageRoutingModule
  ],
  declarations: [CarritoModalPage]
})
export class CarritoModalPageModule {}
