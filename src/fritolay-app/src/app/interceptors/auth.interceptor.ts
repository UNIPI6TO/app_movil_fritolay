import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastCtrl: ToastController) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Adjuntar token si existe
    return from(Preferences.get({ key: 'auth_token' })).pipe(
      switchMap(result => {
        const token = result?.value;
        const cloned = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
        return next.handle(cloned).pipe(
          catchError((err: any) => this.handleError(err))
        );
      })
    ) as unknown as Observable<HttpEvent<any>>;
  }

  private handleError(err: any) {
    // Ejecutar efectos secundarios asíncronos sin convertir la función
    // en una Promise que confunda a `catchError` (evita devolver una Promise)
    if (err instanceof HttpErrorResponse && err.status === 401) {
      (async () => {
        try {
          await Preferences.remove({ key: 'auth_token' });
          await Preferences.remove({ key: 'user_name' });
          await Preferences.remove({ key: 'user_email' });
          await Preferences.remove({ key: 'user_id' });
          const toast = await this.toastCtrl.create({ message: 'Sesión expirada. Inicie sesión nuevamente.', duration: 3000, color: 'warning' });
          await toast.present();
          this.router.navigate(['/login']);
        } catch (ex) {
          console.error('AuthInterceptor.handleError side-effects failed', ex);
        }
      })();
    }
    return throwError(() => err);
  }
}
