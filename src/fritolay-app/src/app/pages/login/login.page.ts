import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  email = 'admin@fritolay.com';
  pass = '123456';

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    // Si ya tiene sesión, ir a catálogo
    this.auth.authState$.subscribe(state => {
      if(state) this.router.navigate(['/catalogo']);
    });
  }

  async login() {
    const valid = await this.auth.login(this.email, this.pass);
    if (valid) {
      this.router.navigate(['/catalogo']);
    } else {
      alert('Credenciales incorrectas');
    }
  }
}