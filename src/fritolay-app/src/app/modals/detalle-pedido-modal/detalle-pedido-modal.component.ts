import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-detalle-pedido-modal',
  templateUrl: './detalle-pedido-modal.component.html',
  styleUrls: ['./detalle-pedido-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, CurrencyPipe, DatePipe]
})
export class DetallePedidoModalComponent implements OnInit {
  idPedido: number = 0;
  pedido: any = null;
  loading = false;
  error: string | null = null;

  constructor(
    private pedidoService: PedidoService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.cargarDetalles();
  }

  async cargarDetalles() {
    this.loading = true;
    this.error = null;

    try {
      // Cargar detalles del pedido
      const pedidoDetalles = await this.pedidoService.obtenerPedidoPorId(this.idPedido);
      this.pedido = pedidoDetalles;
    } catch (err) {
      console.error('Error cargando detalles del pedido:', err);
      this.error = err instanceof Error ? err.message : 'Error al cargar los detalles del pedido.';
    } finally {
      this.loading = false;
    }
  }

  async cerrarModal() {
    await this.modalController.dismiss();
  }

  getEstadoColor(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'pagado':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'cancelado':
        return 'danger';
      default:
        return 'medium';
    }
  }
}
