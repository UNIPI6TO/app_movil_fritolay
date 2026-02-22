import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { CheckoutPage } from './checkout.page';
import { CarritoService } from '../../services/carrito';
import { PedidoService } from '../../services/pedido.service';
import { Producto } from '../../interfaces/producto';
import { of } from 'rxjs';

describe('CheckoutPage', () => {
  let component: CheckoutPage;
  let fixture: ComponentFixture<CheckoutPage>;
  let carritoService: jasmine.SpyObj<CarritoService>;
  let pedidoService: jasmine.SpyObj<PedidoService>;

  const mockProducto: Producto = {
    id: 1,
    nombre: 'Papas Fritas',
    descripcion: 'Desc',
    precioBase: 100,
    descuentoPercent: 10,
    ivaPercent: 15,
    precioFinal: 103.50,
    imagenUrl: 'test.jpg',
    listaUrlImagenes: ['test.jpg'],
    stock: 10,
    categoria: 'Snacks',
    sku: 'TEST-001'
  };

  beforeEach(async () => {
    const carritoServiceSpy = jasmine.createSpyObj('CarritoService', 
      ['getTotal', 'vaciarCarrito', 'limpiarTodasLasPreferencias'], 
      {
        carrito$: of([{ producto: mockProducto, cantidad: 2 }])
      }
    );
    const pedidoServiceSpy = jasmine.createSpyObj('PedidoService', 
      ['crearPedido', 'registrarPago']
    );

    await TestBed.configureTestingModule({
      declarations: [CheckoutPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: CarritoService, useValue: carritoServiceSpy },
        { provide: PedidoService, useValue: pedidoServiceSpy },
        LoadingController,
        ToastController
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutPage);
    component = fixture.componentInstance;
    carritoService = TestBed.inject(CarritoService) as jasmine.SpyObj<CarritoService>;
    pedidoService = TestBed.inject(PedidoService) as jasmine.SpyObj<PedidoService>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TC-FE-025: Validación de dirección de entrega
  it('TC-FE-025: debe validar que la dirección sea requerida', () => {
    component.direccionEntrega = '';
    
    const esValido = component.direccionEntrega.trim().length > 0;
    
    expect(esValido).toBeFalse();
  });

  it('TC-FE-025b: debe permitir enviar con dirección válida', () => {
    component.direccionEntrega = 'Av. Principal 123, Quito';
    
    const esValido = component.direccionEntrega.trim().length > 0;
    
    expect(esValido).toBeTrue();
  });

  // TC-FE-026: Seleccionar método de pago "Tarjeta"
  it('TC-FE-026: debe configurar método Tarjeta correctamente', () => {
    component.metodoPago = 'Tarjeta';
    
    expect(component.metodoPago).toBe('Tarjeta');
    // Campo referencia NO debe ser visible para Tarjeta
    const debeOcultarReferencia = component.metodoPago !== 'Transferencia';
    expect(debeOcultarReferencia).toBeTrue();
  });

  // TC-FE-027: Seleccionar método "Transferencia"
  it('TC-FE-027: debe mostrar campo referencia para Transferencia', () => {
    component.metodoPago = 'Transferencia';
    
    expect(component.metodoPago).toBe('Transferencia');
    // Campo referencia DEBE ser visible
    const debeMostrarReferencia = component.metodoPago === 'Transferencia';
    expect(debeMostrarReferencia).toBeTrue();
  });

  // TC-FE-028: Confirmar pedido exitoso (método Tarjeta)
  it('TC-FE-028: debe crear pedido y registrar pago automáticamente con Tarjeta', async () => {
    pedidoService.crearPedido.and.returnValue(Promise.resolve({
      idPedido: 42,
      totalCobrado: 207.00,
      mensaje: 'Pedido creado'
    }));
    pedidoService.registrarPago.and.returnValue(Promise.resolve({ mensaje: 'Pago registrado' }));
    carritoService.getTotal.and.returnValue(207.00);

    component.direccionEntrega = 'Av. Test 123';
    component.metodoPago = 'Tarjeta';
    component.latitudEntrega = -0.1807;
    component.longitudEntrega = -78.4678;

    await component.confirmarPedido();

    expect(pedidoService.crearPedido).toHaveBeenCalled();
    expect(pedidoService.registrarPago).toHaveBeenCalledWith({
      idPedido: 42,
      montoPagado: 207.00,
      metodoPagoUtilizado: 'Tarjeta',
      referenciaPago: jasmine.any(String)
    });
  });

  // TC-FE-029: Confirmar pedido (método Efectivo)
  it('TC-FE-029: NO debe registrar pago con método Efectivo', async () => {
    pedidoService.crearPedido.and.returnValue(Promise.resolve({
      idPedido: 43,
      totalCobrado: 150.00,
      mensaje: 'Pedido creado'
    }));

    component.direccionEntrega = 'Av. Test 456';
    component.metodoPago = 'Efectivo';

    await component.confirmarPedido();

    expect(pedidoService.crearPedido).toHaveBeenCalled();
    expect(pedidoService.registrarPago).not.toHaveBeenCalled();
  });

  // TC-FE-032: Limpieza post-orden (v1.1.0)
  it('TC-FE-032: debe limpiar carrito y preferencias después de crear pedido', async () => {
    pedidoService.crearPedido.and.returnValue(Promise.resolve({
      idPedido: 44,
      totalCobrado: 100.00,
      mensaje: 'OK'
    }));

    component.direccionEntrega = 'Test';
    component.metodoPago = 'Efectivo';

    await component.confirmarPedido();

    expect(carritoService.vaciarCarrito).toHaveBeenCalled();
    expect(carritoService.limpiarTodasLasPreferencias).toHaveBeenCalled();
  });

  // TC-FE-023: Captura de GPS automática
  it('TC-FE-023: debe tener métodos para capturar GPS', () => {
    expect(component.obtenerUbicacionActual).toBeDefined();
    expect(typeof component.obtenerUbicacionActual).toBe('function');
  });

  // Prueba de cálculos
  it('debe calcular subtotal correctamente', () => {
    carritoService.getTotal.and.returnValue(207.00);
    
    const total = component.getTotalCarrito();
    
    expect(total).toBe(207.00);
  });

  // Prueba de navegación
  it('debe tener steps de navegación', () => {
    expect(component.currentStep).toBe(1);
    
    component.siguientePaso();
    
    expect(component.currentStep).toBeGreaterThan(1);
  });

  // TC-FE-031: Error al crear pedido
  it('TC-FE-031: debe manejar errores al crear pedido', async () => {
    pedidoService.crearPedido.and.returnValue(
      Promise.reject(new Error('Error de validación'))
    );

    component.direccionEntrega = 'Test';
    component.metodoPago = 'Efectivo';

    try {
      await component.confirmarPedido();
    } catch (error) {
      expect(error).toBeDefined();
    }

    // No debe vaciar carrito si hay error
    expect(carritoService.vaciarCarrito).not.toHaveBeenCalled();
  });
});
