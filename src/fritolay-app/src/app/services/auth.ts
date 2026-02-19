import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // URL base de la API leída desde los environment
  public apiUrl = environment.apiUrl;
  
  // Estado reactivo de la sesión
  private authState = new BehaviorSubject<boolean>(false);
  authState$ = this.authState.asObservable();

  constructor(private router: Router, private http: HttpClient) {
    this.checkSession();
  }

  private extractErrorMessage(err: any, fallback = 'Error en la operación'): string {
    if (!err) return fallback;
    // Network / CORS / certificate
    if (err.status === 0) return 'No se pudo conectar al servidor. Verifique que el backend esté en ejecución y que confíe el certificado HTTPS en el navegador.';

    const e = err.error;
    try { console.debug('AuthService.extractErrorMessage - status:', err?.status, 'errorBody:', e); } catch {}
    if (!e) {
      if (err.message) return err.message;
      return fallback;
    }

    if (typeof e === 'string') {
      // Some backends return a JSON string inside the error body; try parsing
      const trimmed = e.trim();
      if ((trimmed.startsWith('{') || trimmed.startsWith('['))) {
        try {
          const parsed = JSON.parse(e);
          if (parsed) {
            if (typeof parsed === 'string') return parsed;
            if (parsed.mensaje) return parsed.mensaje;
            if (parsed.message) return parsed.message;
            if (parsed.detail) return parsed.detail;
            if (parsed.title) return parsed.title;
            // fallthrough to stringify
            return JSON.stringify(parsed);
          }
        } catch {
          // not JSON, continue
        }
      }
      return e;
    }
    if (e.mensaje) return e.mensaje;
    if (e.message) return e.message;
    if (e.Message) return e.Message;

    // ASP.NET validation errors often come in an object under 'errors'
    if (e.errors && typeof e.errors === 'object') {
      try {
        // `flat()` may not be available depending on target lib; concatenate manually
        const raw = Object.values(e.errors);
        const vals: string[] = [];
        for (const item of raw) {
          if (Array.isArray(item)) {
            for (const v of item) {
              if (v != null) vals.push(String(v));
            }
          } else if (item != null) {
            vals.push(String(item));
          }
        }
        return vals.join(' ');
      } catch {
        // fallthrough
      }
    }

    // Fallback to stringifying the object
    try {
      return JSON.stringify(e);
    } catch {
      return fallback;
    }
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

  async login(email: string, pass: string): Promise<{ success: boolean; message?: string }> {
    const url = `${this.apiUrl}api/ControladorCuenta/login`;
    const payload = { CorreoElectronico: email, Contrasena: pass };
    try {
      const resp: any = await firstValueFrom(this.http.post(url, payload));
      if (!resp || !resp.tokenAcceso) return { success: false, message: 'Respuesta inválida del servidor' };

      // Guardar token y datos de usuario
      await Preferences.set({ key: 'auth_token', value: resp.tokenAcceso });
      if (resp.nombreUsuario) await Preferences.set({ key: 'user_name', value: resp.nombreUsuario });
      if (resp.correo) await Preferences.set({ key: 'user_email', value: resp.correo });
      if (resp.idUsuario) await Preferences.set({ key: 'user_id', value: String(resp.idUsuario) });

      this.authState.next(true);
      return { success: true };
    } catch (err: any) {
      const message = this.extractErrorMessage(err, 'Error al iniciar sesión');
      return { success: false, message };
    }
  }

  async register(datos: { Cedula: string; NombreCompleto: string; CorreoElectronico: string; Contrasena: string; Telefono?: string; Direccion?: string; }): Promise<{ success: boolean; message?: string }> {
    const url = `${this.apiUrl}api/ControladorCuenta/registrar`;
    try {
      const resp: any = await firstValueFrom(this.http.post(url, datos));
      const message = resp && resp.mensaje ? resp.mensaje : 'Registro completado';
      return { success: true, message };
    } catch (err: any) {
      const message = this.extractErrorMessage(err, 'Error al registrar usuario');
      return { success: false, message };
    }
  }

  async recuperar(correo: string): Promise<{ success: boolean; message?: string; codigoDebug?: string }> {
    const url = `${this.apiUrl}api/ControladorCuenta/recuperar`;
    try {
      // El backend ahora espera un objeto JSON: { CorreoElectronico }
      const payload = { CorreoElectronico: correo };
      const resp: any = await firstValueFrom(this.http.post(url, payload));
      const message = resp && resp.mensaje ? resp.mensaje : 'Código enviado';
      const codigo = resp && resp.codigoDebug ? resp.codigoDebug : undefined;
      return { success: true, message, codigoDebug: codigo };
    } catch (err: any) {
      const message = this.extractErrorMessage(err, 'Error al solicitar recuperación');
      return { success: false, message };
    }
  }

  async restablecer(datos: { CorreoElectronico: string; CodigoVerificacion: string; NuevaContrasena: string }): Promise<{ success: boolean; message?: string }> {
    const url = `${this.apiUrl}api/ControladorCuenta/restablecer`;
    try {
      const resp: any = await firstValueFrom(this.http.post(url, datos));
      const message = resp && resp.mensaje ? resp.mensaje : 'Contraseña restablecida';
      return { success: true, message };
    } catch (err: any) {
      const message = this.extractErrorMessage(err, 'Error al restablecer contraseña');
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