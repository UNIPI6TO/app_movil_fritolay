import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  // Estado reactivo de la sesión
  private authState = new BehaviorSubject<boolean>(false);
  authState$ = this.authState.asObservable();

  constructor(private router: Router) {
    this.checkSession();
  }

  // Verificar si hay token guardado al abrir la app
  async checkSession() {
    const { value } = await Preferences.get({ key: 'auth_token' });
    if (value) {
      this.authState.next(true);
    } else {
      this.router.navigate(['/login']);
    }
  }

  async login(email: string, pass: string): Promise<boolean> {
    // AQUÍ: Conectarías con tu API Real
    if (email === 'admin@fritolay.com' && pass === '123456') { // Mock simple
      const dummyToken = 'xyz-token-seguro-123';
      
      // Guardar token en dispositivo
      await Preferences.set({ key: 'auth_token', value: dummyToken });
      
      this.authState.next(true);
      return true;
    }
    return false;
  }

  async logout() {
    await Preferences.remove({ key: 'auth_token' });
    this.authState.next(false);
    this.router.navigate(['/login']);
  }
}