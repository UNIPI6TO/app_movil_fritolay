import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth';
import { CarritoService } from 'src/app/services/carrito'; 
import { ProductoService } from 'src/app/services/producto';
import { CarritoModalPage } from '../carrito-modal/carrito-modal.page';
import { ProductoDetallePage } from '../producto-detalle/producto-detalle.page';
import { Producto } from '../../interfaces/producto';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: false
})
export class CatalogoPage implements OnInit {
  productos: Producto[] = [];
  lineas: string[] = [];
  selectedLinea = 'Todas';
  categorias: string[] = [];
  selectedCategoria = 'Todas';
  combinedOptions: { value: string; label: string }[] = [];
  filterCarrito = false;
  cantidadItems = 0;
  loading = true;
  total = 0;
  prodMap: { [id: string]: number } = {};

  constructor(
    private prodService: ProductoService,
    private cartService: CarritoService,
    private auth: AuthService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.prodService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        // construir listado único de líneas y categorías (agregar 'Todas' al inicio)
        const setLineas = new Set<string>();
        const setCategorias = new Set<string>();
        data.forEach(p => {
          if (p.linea) setLineas.add(p.linea);
          if (p.categoria) setCategorias.add(p.categoria);
        });
        this.lineas = ['Todas', ...Array.from(setLineas).sort((a,b)=>a.localeCompare(b))];
        this.categorias = ['Todas', ...Array.from(setCategorias).sort((a,b)=>a.localeCompare(b))];
        // construir opciones combinadas para un solo select
        this.combinedOptions = [];
        this.combinedOptions.push({ value: 'Todas', label: 'Todas' });
        // opción para ver solo los productos que están en el carrito
        this.combinedOptions.push({ value: 'Carrito', label: 'En mi carrito' });
        Array.from(setLineas).sort((a,b)=>a.localeCompare(b)).forEach(l => this.combinedOptions.push({ value: `L:${l}`, label: `Linea: ${l}` }));
        Array.from(setCategorias).sort((a,b)=>a.localeCompare(b)).forEach(c => this.combinedOptions.push({ value: `C:${c}`, label: `Categoria: ${c}` }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener productos', err);
        this.productos = [];
        this.loading = false;
      }
    });
    this.cartService.carrito$.subscribe((items) => {
      this.cantidadItems = this.cartService.getCantidadItemsUnicos();
      this.total = this.cartService.getTotal();
      // construir mapa de cantidades por producto
      this.prodMap = {};
      if (Array.isArray(items)) {
        items.forEach(i => {
          this.prodMap[String(i.producto.id)] = i.cantidad;
        });
      }
    });
  }

  agregar(prod: Producto) {
    this.cartService.agregarProducto(prod);
  }

  aumentar(prod: Producto) {
    this.cartService.agregarProducto(prod);
  }

  reducir(prod: Producto) {
    this.cartService.disminuirProducto(prod);
  }

  borrar(prod: Producto) {
    this.cartService.eliminarProducto(prod);
  }

  getCantidad(prod: Producto) {
    return this.prodMap[String(prod.id)] || 0;
  }

  // Métodos para obtener precios y descuentos
  getPrecioBase(prod: Producto): number {
    return prod.precioBase || 0;
  }

  getPrecioFinal(prod: Producto): number {
    return prod.precioFinal || 0;
  }

  getDescuentoAmount(prod: Producto): number {
    const precioBase = this.getPrecioBase(prod);
    const descuentoPercent = prod.descuentoPercent || 0;
    return (descuentoPercent / 100) * precioBase;
  }

  tieneDescuento(prod: Producto): boolean {
    return (prod.descuentoPercent || 0) > 0;
  }

  // Filtrado reactivo según la línea seleccionada
  get productosFiltrados(): Producto[] {
    if (!this.productos) return [];
    // Si el filtro carrito está activo, devolver solo productos con cantidad > 0
    if (this.filterCarrito) {
      return this.productos.filter(p => this.getCantidad(p) > 0);
    }
    return this.productos.filter(p => {
      const matchLinea = (this.selectedLinea === 'Todas') || ((p.linea || '') === this.selectedLinea);
      const matchCategoria = (this.selectedCategoria === 'Todas') || ((p.categoria || '') === this.selectedCategoria);
      return matchLinea && matchCategoria;
    });
  }

  seleccionarLinea(linea: any) {
    this.selectedLinea = String(linea || 'Todas');
  }

  seleccionarCategoria(cat: any) {
    this.selectedCategoria = String(cat || 'Todas');
  }

  // Getter para el valor actual del filtro combinado
  get selectedFiltroValue(): string {
    if (this.selectedLinea && this.selectedLinea !== 'Todas') return `L:${this.selectedLinea}`;
    if (this.selectedCategoria && this.selectedCategoria !== 'Todas') return `C:${this.selectedCategoria}`;
    return 'Todas';
  }

  seleccionarFiltro(value: any) {
    const v = String(value || 'Todas');
    // reset carrito flag
    this.filterCarrito = false;
    if (v === 'Todas') {
      this.selectedLinea = 'Todas';
      this.selectedCategoria = 'Todas';
      return;
    }
    if (v === 'Carrito') {
      // activar filtro carrito
      this.filterCarrito = true;
      this.selectedLinea = 'Todas';
      this.selectedCategoria = 'Todas';
      return;
    }
    if (v.startsWith('L:')) {
      this.selectedLinea = v.substring(2);
      this.selectedCategoria = 'Todas';
      return;
    }
    if (v.startsWith('C:')) {
      this.selectedCategoria = v.substring(2);
      this.selectedLinea = 'Todas';
      return;
    }
    // fallback
    this.selectedLinea = 'Todas';
    this.selectedCategoria = 'Todas';
  }

  verDetalle(prod: Producto) {
    (async () => {
      const modal = await this.modalCtrl.create({ component: ProductoDetallePage, componentProps: { producto: prod } });
      await modal.present();
      const { data } = await modal.onDidDismiss();
      if (data?.action === 'agregar') {
        this.agregar(prod);
      }
    })();
  }

  async verCarrito() {
    const modal = await this.modalCtrl.create({ component: CarritoModalPage });
    await modal.present();
  }

  logout() {
    this.auth.logout();
  }

  cambiarCantidad(prod: Producto, nuevaCantidad: string | null | undefined) {
    if (!nuevaCantidad) return;
    const cantidad = parseInt(nuevaCantidad, 10);
    const cantidadActual = this.getCantidad(prod);
    
    if (isNaN(cantidad) || cantidad < 0) {
      return;
    }
    
    if (cantidad === 0) {
      this.cartService.eliminarProducto(prod);
    } else if (cantidad > cantidadActual) {
      const diferencia = cantidad - cantidadActual;
      for (let i = 0; i < diferencia; i++) {
        this.cartService.agregarProducto(prod);
      }
    } else if (cantidad < cantidadActual) {
      const diferencia = cantidadActual - cantidad;
      for (let i = 0; i < diferencia; i++) {
        this.cartService.disminuirProducto(prod);
      }
    }
  }
}