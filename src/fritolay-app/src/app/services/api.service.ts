import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  // Limpiar objeto: eliminar propiedades undefined, null o vacías
  private cleanObject(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    
    const cleaned: any = Array.isArray(obj) ? [] : {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        // No incluir si es undefined o null
        if (value !== undefined && value !== null) {
          if (value !== null && typeof value === 'object') {
            cleaned[key] = this.cleanObject(value);
          } else {
            cleaned[key] = value;
          }
        }
      }
    }
    
    return cleaned;
  }

  async post<T = any>(url: string, body: any): Promise<T> {
    try {
      const cleanedBody = this.cleanObject(body);
      return await firstValueFrom(this.http.post<T>(url, cleanedBody));
    } catch (err: any) {
      const msg = await this.extractErrorMessage(err, 'Error en la operación');
      try { if (err) (err as any).friendlyMessage = msg; } catch {}
      throw err;
    }
  }

  async get<T = any>(url: string): Promise<T> {
    try {
      return await firstValueFrom(this.http.get<T>(url));
    } catch (err: any) {
      const msg = await this.extractErrorMessage(err, 'Error en la operación');
      try { if (err) (err as any).friendlyMessage = msg; } catch {}
      throw err;
    }
  }

  // Helpers moved from AuthService
  private tryParseJson(text: string): any | null {
    try { return JSON.parse(text); } catch { return null; }
  }

  private async extractErrorMessage(err: any, fallback = 'Error en la operación'): Promise<string> {
    if (!err) return fallback;
    if (err.status === 0) return 'No se pudo conectar al servidor. Verifique que el backend esté en ejecución y que confíe el certificado HTTPS en el navegador.';

    const e = err.error;

    try {
      if (typeof Blob !== 'undefined' && e instanceof Blob) {
        const txt = await e.text();
        const parsed = this.tryParseJson(txt);
        if (parsed) return this.extractFromParsed(parsed, fallback);
        return txt || fallback;
      }
      if (e instanceof ArrayBuffer) {
        const decoder = new TextDecoder();
        const txt = decoder.decode(e);
        const parsed = this.tryParseJson(txt);
        if (parsed) return this.extractFromParsed(parsed, fallback);
        return txt || fallback;
      }
    } catch {}

    if (typeof e === 'string') {
      const trimmed = e.trim();
      const parsed = this.tryParseJson(trimmed);
      if (parsed) return this.extractFromParsed(parsed, fallback);
      return e;
    }

    return this.extractFromParsed(e, fallback);
  }

  private extractFromParsed(parsed: any, fallback = 'Error en la operación'): string {
    if (!parsed) return fallback;
    if (typeof parsed === 'string') return parsed;
    if (parsed.mensaje) return String(parsed.mensaje);
    if (parsed.message) return String(parsed.message);
    if (parsed.Message) return String(parsed.Message);
    if (parsed.detail) return String(parsed.detail);
    if (parsed.title) return String(parsed.title);
    if (parsed.errors && typeof parsed.errors === 'object') {
      try {
        const raw = Object.values(parsed.errors);
        const vals: string[] = [];
        for (const item of raw) {
          if (Array.isArray(item)) {
            for (const v of item) if (v != null) vals.push(String(v));
          } else if (item != null) vals.push(String(item));
        }
        if (vals.length) return vals.join(' ');
      } catch {}
    }
    try { return JSON.stringify(parsed); } catch { return fallback; }
  }
}
