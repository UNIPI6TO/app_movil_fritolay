import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from '../interfaces/producto';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';

interface BackendProducto {
  idProducto: number;
  nombre: string;
  descripcion: string;
  precioFinal: number;
  sku?: string;
  imagenesUrl: string[];
}

@Injectable({ providedIn: 'root' })
export class ProductoService {
  
  private readonly apiUrl = environment.apiUrl + 'api/ControladorProductos';

  constructor(private api: ApiService) { }

  // Obtiene productos del back-end y los transforma al modelo local
  getProductos(): Observable<Producto[]> {
    const promise = this.api.get<BackendProducto[]>(this.apiUrl);
    return from(promise).pipe(
      map(list => (list || []).map(b => ({
        id: b.idProducto,
        nombre: b.nombre,
        descripcion: b.descripcion,
        precio: b.precioFinal,
        sku: b.sku,
        imagenes: b.imagenesUrl || [],
        categoria: ''
      } as Producto)))
    );
  }
}