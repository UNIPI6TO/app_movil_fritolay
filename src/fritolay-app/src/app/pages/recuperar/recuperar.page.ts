import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

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
  codigoDebug?: string;

  constructor(private auth: AuthService, private toast: ToastService, public router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  async pedirCodigo() {
    if (!this.correo) { await this.toast.show('Ingrese su correo', 2000, 'warning'); return; }
    const loading = await this.loadingCtrl.create({ message: 'Enviando código...' });
    await loading.present();
    const res = await this.auth.recuperar(this.correo);
    await loading.dismiss();
    if (res.success) {
      await this.toast.show(res.message || 'Código enviado', 3000, 'success');
      if (res.codigoDebug) {
        this.codigoDebug = res.codigoDebug;
      }
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

}
