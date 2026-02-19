import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private toastCtrl: ToastController) {}

  async show(message: string, duration = 3000, color: 'success' | 'warning' | 'danger' | 'primary' = 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
