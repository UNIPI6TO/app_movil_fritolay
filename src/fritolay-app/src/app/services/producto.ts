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
  precioBase: number;
  precioFinal: number;
  porcentajeDescuento: number;
  porcentajeImpuesto: number;
  sku?: string;
  imagenesUrl: string[];
  categoria?: string;
  lineaProducto?: string;
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
        precioBase: b.precioBase || 0,
        precioFinal: b.precioFinal || 0,
        descuentoPercent: b.porcentajeDescuento || 0,
        ivaPercent: b.porcentajeImpuesto || 0,
        sku: b.sku,
        imagenes: b.imagenesUrl || [],
        categoria: b.categoria || '',
        linea: b.lineaProducto || ''
      } as Producto)))
    );
  }
}