import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';

// Interfaces para DTOs
export interface DtoCrearPedido {
  metodoPago: string;
  direccionEntrega: string;
  referenciaTransferencia?: string;
  latitudEntrega?: number;
  longitudEntrega?: number;
  productos: {
    idProducto: number;
    cantidad: number;
  }[];
}

export interface DtoRespuestaCrearPedido {
  idPedido: number;
  fechaPedido?: string;
  totalCobrado: number;
  subtotal?: number;
  totalDescuento?: number;
  totalImpuestos?: number;
  mensaje: string;
}

export interface DtoRegistroEntrega {
  idPedido: number;
  cantidadEntregada: number;
  estado: string;
  latitudEntrega?: number;
  longitudEntrega?: number;
  direccionEntregaReal: string;
  observaciones?: string;
  referenciaSeguimiento?: string;
}

export interface DtoRegistroPago {
  idPedido: number;
  montoPagado: number;
  metodoPagoUtilizado: string;
  referenciaPago?: string;
  observaciones?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = `${environment.apiUrl}api/ControladorPedidos`;

  constructor(private api: ApiService) { }

  async crearPedido(pedido: DtoCrearPedido): Promise<DtoRespuestaCrearPedido> {
    try {
      const response = await this.api.post<DtoRespuestaCrearPedido>(`${this.apiUrl}/crear`, pedido);
      return response;
    } catch (error: any) {
      console.error('Error al crear pedido:', error);
      const mensaje = error?.friendlyMessage || 'Error al crear el pedido';
      throw new Error(mensaje);
    }
  }

  async registrarEntrega(entrega: DtoRegistroEntrega): Promise<any> {
    try {
      const response = await this.api.post(`${this.apiUrl}/registrar-entrega`, entrega);
      return response;
    } catch (error: any) {
      console.error('Error al registrar entrega:', error);
      const mensaje = error?.friendlyMessage || 'Error al registrar la entrega';
      throw new Error(mensaje);
    }
  }

  async registrarPago(pago: DtoRegistroPago): Promise<any> {
    try {
      const response = await this.api.post(`${this.apiUrl}/registrar-pago`, pago);
      return response;
    } catch (error: any) {
      console.error('Error al registrar pago:', error);
      const mensaje = error?.friendlyMessage || 'Error al registrar el pago';
      throw new Error(mensaje);
    }
  }

  async obtenerMisPedidos(): Promise<any[]> {
    try {
      const url = `${this.apiUrl}/mis-pedidos`;
      const response = await this.api.get<any[]>(url);
      return response;
    } catch (error: any) {
      console.error('Error al obtener pedidos:', error);
      const mensaje = error?.friendlyMessage || 'Error al obtener los pedidos';
      throw new Error(mensaje);
    }
  }

  async obtenerPedidoPorId(idPedido: number): Promise<any> {
    try {
      const response = await this.api.get<any>(`${this.apiUrl}/${idPedido}`);
      return response;
    } catch (error: any) {
      console.error('Error al obtener pedido:', error);
      const mensaje = error?.friendlyMessage || 'Error al obtener el pedido';
      throw new Error(mensaje);
    }
  }

  async obtenerPagosPedido(idPedido: number): Promise<any> {
    try {
      const response = await this.api.get<any>(`${this.apiUrl}/${idPedido}/pagos`);
      return response;
    } catch (error: any) {
      console.error('Error al obtener pagos:', error);
      const mensaje = error?.friendlyMessage || 'Error al obtener los pagos';
      throw new Error(mensaje);
    }
  }

  async obtenerEntregasPedido(idPedido: number): Promise<any[]> {
    try {
      const response = await this.api.get<any[]>(`${this.apiUrl}/${idPedido}/entregas`);
      return response;
    } catch (error: any) {
      console.error('Error al obtener entregas:', error);
      const mensaje = error?.friendlyMessage || 'Error al obtener las entregas';
      throw new Error(mensaje);
    }
  }
}
