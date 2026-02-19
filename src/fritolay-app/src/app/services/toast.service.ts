import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private toastCtrl: ToastController) {}

  private normalizeMessage(input: any): string {
    if (!input && input !== 0) return '';
    if (typeof input === 'string') {
      const trimmed = input.trim();
      if ((trimmed.startsWith('{') || trimmed.startsWith('['))) {
        try {
          const parsed = JSON.parse(input);
          if (parsed && typeof parsed === 'object') {
            if (parsed.mensaje) return String(parsed.mensaje);
            if (parsed.message) return String(parsed.message);
            if (parsed.detail) return String(parsed.detail);
            if (parsed.title) return String(parsed.title);
            return JSON.stringify(parsed);
          }
        } catch {
          // not JSON
        }
      }
      return input;
    }
    if (typeof input === 'object') {
      if (input.mensaje) return String(input.mensaje);
      if (input.message) return String(input.message);
      if (input.Message) return String(input.Message);
      // If it's an Error-like object
      if (input.error && typeof input.error === 'string') return input.error;
      try {
        return JSON.stringify(input);
      } catch {
        return String(input);
      }
    }
    return String(input);
  }

  async show(message: any, duration = 3000, color: 'success' | 'warning' | 'danger' | 'primary' = 'danger') {
    const text = this.normalizeMessage(message) || '';
    try { console.debug('ToastService.show - original:', message, 'normalized:', text); } catch {}
    const toast = await this.toastCtrl.create({
      message: text,
      duration,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
