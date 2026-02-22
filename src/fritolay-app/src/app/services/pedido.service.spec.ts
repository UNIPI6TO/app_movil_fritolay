import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PedidoService, DtoCrearPedido, DtoRespuestaCrearPedido } from './pedido.service';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';

describe('PedidoService', () => {
  let service: PedidoService;
  let httpMock: HttpTestingController;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PedidoService, ApiService]
    });

    service = TestBed.inject(PedidoService);
    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // TC-FE-028: Confirmar pedido exitoso (método Tarjeta)
  it('TC-FE-028: debe crear pedido correctamente', async () => {
    const mockPedido: DtoCrearPedido = {
      metodoPago: 'Tarjeta',
      direccionEntrega: 'Av. Principal 123, Quito',
      latitudEntrega: -0.1807,
      longitudEntrega: -78.4678,
      productos: [
        { idProducto: 1, cantidad: 2 },
        { idProducto: 2, cantidad: 1 }
      ]
    };

    const mockResponse: DtoRespuestaCrearPedido = {
      idPedido: 42,
      fechaPedido: '2026-02-22T10:30:00',
      totalCobrado: 287.00,
      subtotal: 250.00,
      totalDescuento: 0,
      totalImpuestos: 37.00,
      mensaje: 'Pedido creado exitosamente'
    };

    const createPromise = service.crearPedido(mockPedido);

    const req = httpMock.expectOne(`${environment.apiUrl}api/ControladorPedidos/crear`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.metodoPago).toBe('Tarjeta');
    expect(req.request.body.productos.length).toBe(2);
    req.flush(mockResponse);

    const result = await createPromise;

    expect(result.idPedido).toBe(42);
    expect(result.totalCobrado).toBe(287.00);
    expect(result.mensaje).toContain('exitosamente');
  });

  // TC-FE-030: Limpieza de valores undefined/null (v1.1.0)
  it('TC-FE-030: no debe enviar referenciaTransferencia si es undefined', async () => {
    const mockPedido: DtoCrearPedido = {
      metodoPago: 'Efectivo',
      direccionEntrega: 'Calle 456',
      referenciaTransferencia: undefined, // Este campo no debe enviarse
      productos: [{ idProducto: 1, cantidad: 1 }]
    };

    const mockResponse: DtoRespuestaCrearPedido = {
      idPedido: 43,
      totalCobrado: 100,
      mensaje: 'OK'
    };

    const createPromise = service.crearPedido(mockPedido);

    const req = httpMock.expectOne(`${environment.apiUrl}api/ControladorPedidos/crear`);
    
    // cleanObject() debe haber eliminado referenciaTransferencia
    expect(req.request.body.hasOwnProperty('referenciaTransferencia')).toBeFalse();
    
    req.flush(mockResponse);
    await createPromise;
  });

  // TC-FE-031: Error al crear pedido (Backend 400)
  it('TC-FE-031: debe manejar errores del backend', async () => {
    const mockPedido: DtoCrearPedido = {
      metodoPago: 'Tarjeta',
      direccionEntrega: '', // Dirección vacía causará error
      productos: []
    };

    try {
      const createPromise = service.crearPedido(mockPedido);

      const req = httpMock.expectOne(`${environment.apiUrl}api/ControladorPedidos/crear`);
      req.flush(
        { mensaje: 'Error de validación', errores: ['La dirección es requerida'] },
        { status: 400, statusText: 'Bad Request' }
      );

      await createPromise;
      fail('Debería haber lanzado un error');
    } catch (error: any) {
      expect(error.message).toBeTruthy();
      expect(error.message).toContain('Error');
    }
  });

  // TC-FE-034: Listar pedidos del usuario (v1.1.0)
  it('TC-FE-034: debe obtener lista de pedidos del usuario', async () => {
    const mockPedidos = [
      {
        idPedido: 1,
        fechaPedido: '2026-02-20T10:00:00',
        estadoPedido: 'Completado',
        direccionEntrega: 'Calle 123',
        metodoPago: 'Tarjeta',
        totalPagar: 150.00,
        pagoRegistrado: true
      },
      {
        idPedido: 2,
        fechaPedido: '2026-02-22T14:30:00',
        estadoPedido: 'Pendiente',
        direccionEntrega: 'Av. Principal 456',
        metodoPago: 'Efectivo',
        totalPagar: 89.50,
        pagoRegistrado: false
      }
    ];

    const listPromise = service.obtenerMisPedidos();

    const req = httpMock.expectOne(`${environment.apiUrl}api/ControladorPedidos/mis-pedidos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPedidos);

    const result = await listPromise;

    expect(result.length).toBe(2);
    expect(result[0].idPedido).toBe(1);
    expect(result[1].estadoPedido).toBe('Pendiente');
  });

  // TC-FE-036: Ver detalle completo de pedido (v1.1.0)
  it('TC-FE-036: debe obtener detalle completo de un pedido', async () => {
    const mockDetalle = {
      idPedido: 42,
      fechaPedido: '2026-02-22T10:30:00',
      estadoPedido: 'Completado',
      metodoPago: 'Tarjeta',
      referenciaTransferencia: null,
      direccionEntrega: 'Av. Principal 123',
      latitudEntrega: -0.1807,
      longitudEntrega: -78.4678,
      subtotal: 250.00,
      totalImpuestos: 37.00,
      totalPagar: 287.00,
      pagoRegistrado: true,
      productos: [
        {
          nombreProducto: 'Papas Fritas',
          cantidad: 2,
          precioUnitario: 100.00,
          subtotal: 200.00,
          impuesto: 30.00,
          total: 230.00
        },
        {
          nombreProducto: 'Doritos',
          cantidad: 1,
          precioUnitario: 57.00,
          subtotal: 50.00,
          impuesto: 7.00,
          total: 57.00
        }
      ]
    };

    const detallePromise = service.obtenerDetallePedido(42);

    const req = httpMock.expectOne(`${environment.apiUrl}api/ControladorPedidos/42`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDetalle);

    const result = await detallePromise;

    expect(result.idPedido).toBe(42);
    expect(result.productos.length).toBe(2);
    expect(result.latitudEntrega).toBe(-0.1807);
    expect(result.longitudEntrega).toBe(-78.4678);
  });

  // Prueba de registrar pago
  it('debe registrar pago correctamente', async () => {
    const mockPago = {
      idPedido: 42,
      montoPagado: 287.00,
      metodoPagoUtilizado: 'Tarjeta',
      referenciaPago: 'TXN-12345',
      observaciones: 'Pago confirmado'
    };

    const mockResponse = {
      mensaje: 'Pago registrado exitosamente',
      idPago: 101
    };

    const pagoPromise = service.registrarPago(mockPago);

    const req = httpMock.expectOne(`${environment.apiUrl}api/ControladorPedidos/registrar-pago`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.montoPagado).toBe(287.00);
    req.flush(mockResponse);

    const result = await pagoPromise;

    expect(result.mensaje).toContain('exitosamente');
  });

  // Prueba de registrar entrega
  it('debe registrar entrega correctamente', async () => {
    const mockEntrega = {
      idPedido: 42,
      cantidadEntregada: 3,
      estado: 'Entregado',
      latitudEntrega: -0.1807,
      longitudEntrega: -78.4678,
      direccionEntregaReal: 'Av. Principal 123, Quito',
      observaciones: 'Entrega completada',
      referenciaSeguimiento: 'TRACK-ABC123'
    };

    const mockResponse = {
      mensaje: 'Entrega registrada exitosamente',
      idEntrega: 201
    };

    const entregaPromise = service.registrarEntrega(mockEntrega);

    const req = httpMock.expectOne(`${environment.apiUrl}api/ControladorPedidos/registrar-entrega`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    const result = await entregaPromise;

    expect(result.mensaje).toContain('exitosamente');
  });

  // TC-FE-035: Pedidos vacíos
  it('TC-FE-035: debe manejar lista vacía de pedidos', async () => {
    const listPromise = service.obtenerMisPedidos();

    const req = httpMock.expectOne(`${environment.apiUrl}api/ControladorPedidos/mis-pedidos`);
    req.flush([]);

    const result = await listPromise;

    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });

  // TC-FE-052: No enviar precios al backend (Zero Trust)
  it('TC-FE-052: solo debe enviar idProducto y cantidad, no precios', async () => {
    const mockPedido: DtoCrearPedido = {
      metodoPago: 'Efectivo',
      direccionEntrega: 'Calle Test',
      productos: [
        { idProducto: 5, cantidad: 3 }
      ]
    };

    const mockResponse: DtoRespuestaCrearPedido = {
      idPedido: 50,
      totalCobrado: 150,
      mensaje: 'OK'
    };

    const createPromise = service.crearPedido(mockPedido);

    const req = httpMock.expectOne(`${environment.apiUrl}api/ControladorPedidos/crear`);
    
    // Verificar que solo se envían idProducto y cantidad
    const productoEnviado = req.request.body.productos[0];
    expect(productoEnviado.idProducto).toBe(5);
    expect(productoEnviado.cantidad).toBe(3);
    expect(productoEnviado.hasOwnProperty('precio')).toBeFalse();
    expect(productoEnviado.hasOwnProperty('subtotal')).toBeFalse();
    expect(productoEnviado.hasOwnProperty('impuesto')).toBeFalse();
    
    req.flush(mockResponse);
    await createPromise;
  });
});
