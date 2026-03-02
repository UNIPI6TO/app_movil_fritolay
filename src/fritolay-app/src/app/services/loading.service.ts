import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(private loadingCtrl: LoadingController) {}

  async show(message = 'Cargando...') {
    if (this.loading) return;
    this.loading = await this.loadingCtrl.create({ message, backdropDismiss: false });
    await this.loading.present();
  }

  async hide() {
    if (!this.loading) return;
    await this.loading.dismiss();
    this.loading = null;
  }
}
