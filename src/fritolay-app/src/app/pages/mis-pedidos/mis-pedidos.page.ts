import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-mis-pedidos',
  templateUrl: './mis-pedidos.page.html',
  styleUrls: ['./mis-pedidos.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, DecimalPipe, DatePipe]
})
export class MisPedidosPage implements OnInit {
  pedidos: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.loading = true;
    this.error = null;
    this.http.get<any[]>('/api/pedidos/mis-pedidos').subscribe({
      next: (data) => {
        this.pedidos = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando pedidos', err);
        this.error = 'No se pudieron cargar los pedidos.';
        this.loading = false;
      }
    });
  }

}
