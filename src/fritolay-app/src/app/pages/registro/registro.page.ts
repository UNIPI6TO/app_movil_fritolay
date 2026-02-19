import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage implements OnInit {

  cedula = '';
  nombre = '';
  correo = '';
  contrasena = '';
  telefono = '';
  direccion = '';

  constructor(private auth: AuthService, private toast: ToastService, public router: Router, private loadingCtrl: LoadingController, private location: Location) { }

  ngOnInit() {
  }

  async register() {
    if (!this.cedula || !this.nombre || !this.correo || !this.contrasena) {
      await this.toast.show('Complete los campos requeridos', 2500, 'warning');
      return;
    }

    const payload = {
      Cedula: this.cedula,
      NombreCompleto: this.nombre,
      CorreoElectronico: this.correo,
      Contrasena: this.contrasena,
      Telefono: this.telefono,
      Direccion: this.direccion
    };

    const loading = await this.loadingCtrl.create({ message: 'Registrando...' });
    await loading.present();
    const res = await this.auth.register(payload);
    await loading.dismiss();

    if (res.success) {
      await this.toast.show(res.message || 'Registrado correctamente', 3000, 'success');
      this.router.navigate(['/login']);
    } else {
      await this.toast.show(res.message || 'Error en registro', 3000, 'danger');
    }
  }

  goBack() {
    this.location.back();
  }

}
