import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { Preferences } from '@capacitor/preferences';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // URL base de la API leída desde los environment
  public apiUrl = environment.apiUrl;
  
  // Estado reactivo de la sesión
  private authState = new BehaviorSubject<boolean>(false);
  authState$ = this.authState.asObservable();

  constructor(private router: Router, private api: ApiService) {
    this.checkSession();
  }

  // Extracción de mensaje centralizada en `ApiService`.

  // Verificar si hay token guardado al abrir la app
  async checkSession() {
    const { value } = await Preferences.get({ key: 'auth_token' });
    if (value) {
      this.authState.next(true);
    } else {
      this.router.navigate(['/login']);
    }
  }

  async login(email: string, pass: string): Promise<{ success: boolean; message?: string }> {
    const url = `${this.apiUrl}api/ControladorCuenta/login`;
    const payload = { CorreoElectronico: email, Contrasena: pass };
    try {
      const resp: any = await this.api.post(url, payload);
      if (!resp || !resp.tokenAcceso) return { success: false, message: 'Respuesta inválida del servidor' };

      // Guardar token y datos de usuario
      await Preferences.set({ key: 'auth_token', value: resp.tokenAcceso });
      if (resp.nombreUsuario) await Preferences.set({ key: 'user_name', value: resp.nombreUsuario });
      if (resp.correo) await Preferences.set({ key: 'user_email', value: resp.correo });
      if (resp.idUsuario) await Preferences.set({ key: 'user_id', value: String(resp.idUsuario) });

      this.authState.next(true);
      return { success: true };
    } catch (err: any) {
      const message = err && err.friendlyMessage ? err.friendlyMessage : 'Error al iniciar sesión';
      return { success: false, message };
    }
  }

  async register(datos: { Cedula: string; NombreCompleto: string; CorreoElectronico: string; Contrasena: string; Telefono?: string; Direccion?: string; }): Promise<{ success: boolean; message?: string }> {
    const url = `${this.apiUrl}api/ControladorCuenta/registrar`;
    try {
      const resp: any = await this.api.post(url, datos);
      const message = resp && resp.mensaje ? resp.mensaje : 'Registro completado';
      return { success: true, message };
    } catch (err: any) {
      const message = err && err.friendlyMessage ? err.friendlyMessage : 'Error al registrar usuario';
      return { success: false, message };
    }
  }

  async recuperar(correo: string): Promise<{ success: boolean; message?: string; codigoDebug?: string }> {
    const url = `${this.apiUrl}api/ControladorCuenta/recuperar`;
    let resp: any;
    try {
      // El backend ahora espera un objeto JSON: { CorreoElectronico }
      const payload = { CorreoElectronico: correo };
      resp = await this.api.post(url, payload);
      const message = resp && resp.mensaje ? resp.mensaje : 'Código enviado';
      const codigo = resp && resp.codigoDebug ? resp.codigoDebug : undefined;
      return { success: true, message, codigoDebug: codigo };
    } catch (err: any) {
      const message = err && err.friendlyMessage ? err.friendlyMessage : 'Error al enviar código de recuperación';
      return { success: false, message };
    }
  }

  async restablecer(datos: { CorreoElectronico: string; CodigoVerificacion: string; NuevaContrasena: string }): Promise<{ success: boolean; message?: string }> {
    const url = `${this.apiUrl}api/ControladorCuenta/restablecer`;
    try {
      const resp: any = await this.api.post(url, datos);
      const message = resp && resp.mensaje ? resp.mensaje : 'Contraseña restablecida';
      return { success: true, message };
    } catch (err: any) {
      const message = err && err.friendlyMessage ? err.friendlyMessage : 'Error al restablecer contraseña';
      return { success: false, message };
    }
  }

  async logout() {
    await Preferences.remove({ key: 'auth_token' });
    await Preferences.remove({ key: 'user_name' });
    await Preferences.remove({ key: 'user_email' });
    await Preferences.remove({ key: 'user_id' });
    this.authState.next(false);
    this.router.navigate(['/login']);
  }
}