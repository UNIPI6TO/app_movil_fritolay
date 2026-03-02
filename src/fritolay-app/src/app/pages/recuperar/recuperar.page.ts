import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
  standalone: false,
})
export class RecuperarPage implements OnInit {

  correo = '';
  codigo = '';
  nuevaContrasena = '';
  step: 1 | 2 = 1;
  // tiempo restante en segundos (5 minutos por defecto)
  timerSeconds = 0;
  timerDisplay = '';
  timerInterval: any = null;
  codigoDebug?: string; // guardado solo para debugging interno
  canRequestNew = false;

  constructor(private auth: AuthService, private toast: ToastService, public router: Router, private loadingCtrl: LoadingController, private location: Location) { }

  ngOnInit() {
    this.resetState();
  }

  // Ionic lifecycle: se ejecuta cada vez que la página entra en vista
  ionViewWillEnter() {
    this.resetState();
  }

  async pedirCodigo() {
    if (!this.correo) { await this.toast.show('Ingrese su correo', 2000, 'warning'); return; }
    const loading = await this.loadingCtrl.create({ message: 'Enviando código...' });
    await loading.present();
    // limpiar campos previos de código/contraseña cuando solicitamos uno nuevo
    this.codigo = '';
    this.nuevaContrasena = '';
    this.canRequestNew = false;
    this.clearTimer();

    const res = await this.auth.recuperar(this.correo);
    await loading.dismiss();
    if (res.success) {
      await this.toast.show(res.message || 'Código enviado', 3000, 'success');
      // iniciar contador (el backend asigna 5 minutos de validez en este proyecto)
      this.startTimer(5 * 60);
      if (res.codigoDebug) this.codigoDebug = res.codigoDebug; // no se muestra en UI
      this.step = 2;
    } else {
      await this.toast.show(res.message || 'Error', 3000, 'danger');
    }
  }

  async restablecer() {
    if (!this.codigo || !this.nuevaContrasena) { await this.toast.show('Complete código y nueva contraseña', 2500, 'warning'); return; }
    const payload = { CorreoElectronico: this.correo, CodigoVerificacion: this.codigo, NuevaContrasena: this.nuevaContrasena };
    const loading = await this.loadingCtrl.create({ message: 'Restableciendo contraseña...' });
    await loading.present();
    const res = await this.auth.restablecer(payload);
    await loading.dismiss();
    if (res.success) {
      await this.toast.show(res.message || 'Contraseña restablecida', 3000, 'success');
      this.router.navigate(['/login']);
    } else {
      await this.toast.show(res.message || 'Error', 3000, 'danger');
    }
  }

  startTimer(seconds: number) {
    this.clearTimer();
    this.timerSeconds = seconds;
    this.canRequestNew = false;
    this.updateTimerDisplay();
    this.timerInterval = window.setInterval(() => {
      this.timerSeconds -= 1;
      if (this.timerSeconds <= 0) {
        this.clearTimer();
        this.canRequestNew = true;
        this.timerDisplay = 'Expirado';
      } else {
        this.updateTimerDisplay();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const m = Math.floor(this.timerSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(this.timerSeconds % 60).toString().padStart(2, '0');
    this.timerDisplay = `${m}:${s}`;
  }

  clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  resetState() {
    this.correo = '';
    this.codigo = '';
    this.nuevaContrasena = '';
    this.step = 1;
    this.canRequestNew = false;
    this.codigoDebug = undefined;
    this.clearTimer();
    this.timerDisplay = '';
  }

  goBack() {
    this.location.back();
  }

}
