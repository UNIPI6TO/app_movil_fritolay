import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule, DatePipe } from '@angular/common';
import { PedidoService } from '../../services/pedido.service';
import { DetallePedidoModalComponent } from '../../modals/detalle-pedido-modal/detalle-pedido-modal.component';

@Component({
  selector: 'app-mis-pedidos',
  templateUrl: './mis-pedidos.page.html',
  styleUrls: ['./mis-pedidos.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, DatePipe]
})
export class MisPedidosPage implements OnInit {
  pedidos: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private pedidoService: PedidoService,
    private modalController: ModalController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.cargarPedidos();
  }

  async cargarPedidos() {
    this.loading = true;
    this.error = null;
    try {
      const datos = await this.pedidoService.obtenerMisPedidos();
      this.pedidos = datos || [];
    } catch (err) {
      console.error('❌ Error cargando pedidos:', err);
      const mensajeError = err instanceof Error ? err.message : 'No se pudieron cargar los pedidos.';
      this.error = mensajeError;
      await this.mostrarToast(mensajeError, 'danger');
    } finally {
      this.loading = false;
    }
  }

  async mostrarToast(mensaje: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom',
      color: color,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  async abrirDetallePedido(pedido: any) {
    const modal = await this.modalController.create({
      component: DetallePedidoModalComponent,
      componentProps: {
        idPedido: pedido.idPedido
      }
    });

    await modal.present();
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
