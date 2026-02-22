import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { CarritoService } from 'src/app/services/carrito';
import { PedidoService } from 'src/app/services/pedido.service';
import { Producto } from '../../interfaces/producto';
import { Geolocation } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: false
})
export class CheckoutPage implements OnInit {
  currentStep = 1; // 1: Confirmar, 2: Entrega, 3: Pago
  items: { producto: Producto, cantidad: number }[] = [];

  // Datos de entrega
  latitudEntrega: number = 0;
  longitudEntrega: number = 0;
  direccionEntrega: string = '';

  // Datos de pago
  metodoPago: string = 'Efectivo'; // Efectivo, Transferencia, Tarjeta
  referenciaTransferencia: string = '';
  
  // Simulación de tarjeta (NO se guarda en BD)
  tarjetaNumero: string = '';
  tarjetaNombre: string = '';
  tarjetaExpiracion: string = '';
  tarjetaCvv: string = '';

  constructor(
    private cartService: CarritoService,
    private pedidoService: PedidoService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  async ngOnInit() {
    this.cartService.carrito$.subscribe(datos => {
      this.items = datos;
      if (this.items.length === 0) {
        // Si no hay productos, regresar
        this.router.navigate(['/catalogo']);
      }
    });
    
    // Cargar datos de entrega guardados
    await this.cargarDatosEntrega();
    
    // Obtener ubicación actual al cargar si no hay datos guardados
    if (this.latitudEntrega === 0 || this.longitudEntrega === 0) {
      this.obtenerUbicacionActual();
    }
  }

  // ===== CÁLCULOS =====
  getPrecioBase(producto: Producto): number {
    return producto.precioBase || 0;
  }

  getPrecioFinal(producto: Producto): number {
    return producto.precioFinal || 0;
  }

  getDescuentoPercent(producto: Producto): number {
    return producto.descuentoPercent || 0;
  }

  getSubtotal(item: { producto: Producto, cantidad: number }): number {
    return this.getPrecioBase(item.producto) * item.cantidad;
  }

  getDescuentoTotal(item: { producto: Producto, cantidad: number }): number {
    const precioBase = this.getPrecioBase(item.producto);
    const descuentoPercent = this.getDescuentoPercent(item.producto);
    const descuentoAmount = (descuentoPercent / 100) * precioBase;
    return descuentoAmount * item.cantidad;
  }

  getPrecioFinalTotal(item: { producto: Producto, cantidad: number }): number {
    return this.getPrecioFinal(item.producto) * item.cantidad;
  }

  getSubtotalCarrito(): number {
    return this.items.reduce((acc, item) => acc + this.getSubtotal(item), 0);
  }

  getTotalDescuentoCarrito(): number {
    return this.items.reduce((acc, item) => acc + this.getDescuentoTotal(item), 0);
  }

  getTotalIvaCarrito(): number {
    let ivaTotal = 0;
    this.items.forEach(item => {
      const precioBase = this.getPrecioBase(item.producto);
      const descuentoPercent = this.getDescuentoPercent(item.producto);
      const descuentoAmount = (descuentoPercent / 100) * precioBase;
      const precioConDescuento = Math.max(0, precioBase - descuentoAmount);
      const ivaPercent = item.producto.ivaPercent || 0;
      const ivaAmount = precioConDescuento * (ivaPercent / 100);
      ivaTotal += ivaAmount * item.cantidad;
    });
    return ivaTotal;
  }

  getTotalCarrito(): number {
    return this.cartService.getTotal();
  }

  getImagenProducto(producto: Producto): string {
    return producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes[0] : 'assets/no-image.png';
  }

  // ===== NAVEGACIÓN DE PASOS =====
  async siguientePaso() {
    if (this.currentStep === 1) {
      // Validar que haya items
      if (this.items.length === 0) {
        this.mostrarToast('No hay productos en el carrito', 'warning');
        return;
      }
      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      // Validar datos de entrega
      if (!this.direccionEntrega.trim()) {
        this.mostrarToast('Por favor ingrese la dirección de entrega', 'warning');
        return;
      }
      if (this.latitudEntrega === 0 || this.longitudEntrega === 0) {
        this.mostrarToast('Por favor seleccione la ubicación en el mapa', 'warning');
        return;
      }
      
      // Guardar datos de entrega antes de avanzar al paso 3
      await this.guardarDatosEntrega();
      
      this.currentStep = 3;
    }
  }

  pasoAnterior() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // ===== UBICACIÓN =====
  async obtenerUbicacionActual() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.latitudEntrega = coordinates.coords.latitude;
      this.longitudEntrega = coordinates.coords.longitude;
      console.log('Ubicación obtenida:', this.latitudEntrega, this.longitudEntrega);
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      this.mostrarToast('No se pudo obtener la ubicación. Seleccione manualmente en el mapa.', 'warning');
    }
  }

  // Este método será llamado desde el componente de mapa
  onUbicacionSeleccionada(event: { lat: number; lng: number }) {
    this.latitudEntrega = event.lat;
    this.longitudEntrega = event.lng;
    console.log('Ubicación seleccionada:', event);
  }

  // ===== PAGO Y CREACIÓN DE PEDIDO =====
  async confirmarPedido() {
    // Validar método de pago
    if (this.metodoPago === 'Transferencia' && !this.referenciaTransferencia.trim()) {
      this.mostrarToast('Por favor ingrese la referencia de transferencia', 'warning');
      return;
    }

    if (this.metodoPago === 'Tarjeta') {
      if (!this.validarTarjeta()) {
        return;
      }
    }

    // Procesar pedido directamente
    this.crearPedido();
  }

  validarTarjeta(): boolean {
    if (!this.tarjetaNumero || this.tarjetaNumero.length < 13) {
      this.mostrarToast('Número de tarjeta inválido', 'danger');
      return false;
    }
    if (!this.tarjetaNombre.trim()) {
      this.mostrarToast('Ingrese el nombre del titular', 'danger');
      return false;
    }
    if (!this.tarjetaExpiracion || !this.validarFechaExpiracion(this.tarjetaExpiracion)) {
      this.mostrarToast('Fecha de expiración inválida', 'danger');
      return false;
    }
    if (!this.tarjetaCvv || this.tarjetaCvv.length < 3) {
      this.mostrarToast('CVV inválido', 'danger');
      return false;
    }
    return true;
  }

  validarFechaExpiracion(fecha: string): boolean {
    // Formato esperado: MM/YY
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(fecha)) return false;

    const [mes, anio] = fecha.split('/').map(v => parseInt(v));
    const fechaExp = new Date(2000 + anio, mes - 1);
    const ahora = new Date();
    
    return fechaExp > ahora;
  }

  async crearPedido() {
    const loading = await this.loadingCtrl.create({
      message: 'Procesando pedido...'
    });
    await loading.present();

    try {
      // Preparar datos del pedido con nomenclatura del backend (PascalCase)
      const productos = this.items.map(item => ({
        IdProducto: item.producto.id,
        Cantidad: item.cantidad
      }));

      const pedidoData: any = {
        MetodoPago: this.metodoPago,
        DireccionEntrega: this.direccionEntrega,
        ReferenciaTransferencia: this.metodoPago === 'Transferencia' ? this.referenciaTransferencia : null,
        LatitudEntrega: this.latitudEntrega,
        LongitudEntrega: this.longitudEntrega,
        Productos: productos
      };

      // Llamar al servicio de API para crear el pedido
      const resultado = await this.pedidoService.crearPedido(pedidoData);
      console.log('Pedido creado:', resultado);
      
      // NOTA: Los pagos se registran posteriormente:
      // - Efectivo: Se registra cuando el repartidor entrega y recibe el pago
      // - Transferencia: Se registra cuando el administrador verifica la transferencia
      // - Tarjeta: Es simulación, no se registra en base de datos real

      loading.dismiss();

      // Limpiar carrito
      this.items.forEach(item => {
        this.cartService.eliminarProducto(item.producto);
      });
      
      // Limpiar datos de entrega guardados
      await this.limpiarDatosEntrega();

      // Mostrar éxito con toast
      await this.mostrarToast(
        `¡Pedido #${resultado.idPedido} creado exitosamente! Total: $${resultado.totalCobrado.toFixed(2)}`,
        'success'
      );
      
      // Navegar a mis pedidos después de un breve delay
      setTimeout(() => {
        this.router.navigate(['/mis-pedidos']);
      }, 2000);

    } catch (error: any) {
      loading.dismiss();
      console.error('Error al crear pedido:', error);
      const mensaje = error.message || 'Error al procesar el pedido. Intente nuevamente.';
      this.mostrarToast(mensaje, 'danger');
    }
  }

  async mostrarToast(mensaje: string, color: string = 'dark') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: color === 'success' ? 3500 : 2500,
      color: color,
      position: 'top',
      icon: color === 'success' ? 'checkmark-circle' : color === 'danger' ? 'alert-circle' : 'information-circle'
    });
    await toast.present();
  }

  cancelar() {
    this.router.navigate(['/catalogo']);
  }

  // ===== GESTIÓN DE DATOS DE ENTREGA EN LOCALSTORAGE =====
  private async guardarDatosEntrega() {
    try {
      const datosEntrega = {
        latitudEntrega: this.latitudEntrega,
        longitudEntrega: this.longitudEntrega,
        direccionEntrega: this.direccionEntrega
      };
      
      await Preferences.set({
        key: 'checkout_delivery_data',
        value: JSON.stringify(datosEntrega)
      });
      
      console.log('Datos de entrega guardados');
    } catch (error) {
      console.error('Error al guardar datos de entrega:', error);
    }
  }

  private async cargarDatosEntrega() {
    try {
      const { value } = await Preferences.get({ key: 'checkout_delivery_data' });
      
      if (value) {
        const datosEntrega = JSON.parse(value);
        this.latitudEntrega = datosEntrega.latitudEntrega || 0;
        this.longitudEntrega = datosEntrega.longitudEntrega || 0;
        this.direccionEntrega = datosEntrega.direccionEntrega || '';
        
        console.log('Datos de entrega cargados:', datosEntrega);
      }
    } catch (error) {
      console.error('Error al cargar datos de entrega:', error);
    }
  }

  private async limpiarDatosEntrega() {
    try {
      await Preferences.remove({ key: 'checkout_delivery_data' });
      console.log('Datos de entrega limpiados');
    } catch (error) {
      console.error('Error al limpiar datos de entrega:', error);
    }
  }
}
