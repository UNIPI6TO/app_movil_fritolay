import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  email = 'wilson-ivan-salinas@hotmail.com';
  pass = 'HeyWilson2017';
  isLoading = false;

  constructor(private auth: AuthService, public router: Router, private toast: ToastService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    // Si ya tiene sesión, ir a catálogo
    this.auth.authState$.subscribe(state => {
      if(state) this.router.navigate(['/catalogo']);
    });
  }

  async login() {
    if (!this.email || !this.pass) {
      await this.toast.show('Correo y contraseña son requeridos', 2500, 'warning');
      return;
    }
    this.isLoading = true;
    const loading = await this.loadingCtrl.create({ message: 'Iniciando sesión...' });
    await loading.present();
    const result = await this.auth.login(this.email, this.pass);
    await loading.dismiss();
    this.isLoading = false;
    if (result.success) {
      this.router.navigate(['/catalogo']);
    } else {
      await this.toast.show(result.message || 'Credenciales incorrectas', 3000, 'danger');
    }
  }
}