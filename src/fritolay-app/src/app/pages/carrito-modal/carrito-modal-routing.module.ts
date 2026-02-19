import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarritoModalPage } from './carrito-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CarritoModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarritoModalPageRoutingModule {}
