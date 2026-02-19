import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule) },
  { path: 'recuperar', loadChildren: () => import('./pages/recuperar/recuperar.module').then( m => m.RecuperarPageModule) },
  { path: 'catalogo', loadChildren: () => import('./pages/catalogo/catalogo.module').then( m => m.CatalogoPageModule) },
  { path: 'carrito-modal', loadChildren: () => import('./pages/carrito-modal/carrito-modal.module').then( m => m.CarritoModalPageModule) },
  { path: 'registro', loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule) },
  { path: 'privacy', loadChildren: () => import('./pages/privacy/privacy.module').then( m => m.PrivacyPageModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
