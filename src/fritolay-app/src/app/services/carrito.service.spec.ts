import { TestBed } from '@angular/core/testing';
import { CarritoService } from './carrito';
import { Preferences } from '@capacitor/preferences';
import { Producto } from '../interfaces/producto';

describe('CarritoService', () => {
  let service: CarritoService;

  // Mock de Preferences
  const mockPreferences = {
    get: jasmine.createSpy('get').and.returnValue(Promise.resolve({ value: null })),
    set: jasmine.createSpy('set').and.returnValue(Promise.resolve()),
    remove: jasmine.createSpy('remove').and.returnValue(Promise.resolve())
  };

  // Producto de prueba
  const mockProducto: Producto = {
    id: 1,
    nombre: 'Papas Fritas Lay\'s',
    descripcion: 'Papas fritas clásicas',
    precioBase: 100,
    descuentoPercent: 10,
    ivaPercent: 15,
    precioFinal: 103.50,
    imagenUrl: 'https://example.com/image.jpg',
    listaUrlImagenes: ['https://example.com/image.jpg'],
    stock: 50,
    categoria: 'Snacks',
    sku: 'LAY-001'
  };

  const mockProducto2: Producto = {
    id: 2,
    nombre: 'Doritos',
    descripcion: 'Nachos con queso',
    precioBase: 80,
    descuentoPercent: 0,
    ivaPercent: 0,
    precioFinal: 80,
    imagenUrl: 'https://example.com/doritos.jpg',
    listaUrlImagenes: ['https://example.com/doritos.jpg'],
    stock: 30,
    categoria: 'Snacks',
    sku: 'DOR-001'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CarritoService]
    });

    service = TestBed.inject(CarritoService);

    // Reemplazar Preferences con el mock
    spyOn(Preferences, 'get').and.callFake(mockPreferences.get);
    spyOn(Preferences, 'set').and.callFake(mockPreferences.set);
    spyOn(Preferences, 'remove').and.callFake(mockPreferences.remove);
  });

  // TC-FE-014: Agregar producto nuevo al carrito
  it('TC-FE-014: debe agregar un producto nuevo al carrito', async () => {
    await service.agregarProducto(mockProducto);

    service.carrito$.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].producto.id).toBe(1);
      expect(items[0].cantidad).toBe(1);
    });

    expect(Preferences.set).toHaveBeenCalledWith({
      key: 'carrito_compras',
      value: jasmine.any(String)
    });
  });

  // TC-FE-015: Incrementar cantidad de producto existente
  it('TC-FE-015: debe incrementar cantidad si producto ya existe', async () => {
    await service.agregarProducto(mockProducto);
    await service.agregarProducto(mockProducto); // Agregar el mismo producto

    service.carrito$.subscribe(items => {
      expect(items.length).toBe(1); // No duplica
      expect(items[0].cantidad).toBe(2); // Incrementa cantidad
    });
  });

  // TC-FE-016: Modificar cantidad con controles +/-
  it('TC-FE-016: debe decrementar cantidad con control -', async () => {
    await service.agregarProducto(mockProducto);
    await service.agregarProducto(mockProducto); // cantidad = 2
    
    await service.disminuirProducto(mockProducto);

    service.carrito$.subscribe(items => {
      expect(items[0].cantidad).toBe(1);
    });
  });

  it('TC-FE-016b: debe eliminar producto si cantidad llega a 0', async () => {
    await service.agregarProducto(mockProducto); // cantidad = 1
    
    await service.disminuirProducto(mockProducto); // cantidad = 0, debe eliminar

    service.carrito$.subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  // TC-FE-017: Eliminar producto del carrito
  it('TC-FE-017: debe eliminar un producto del carrito', async () => {
    await service.agregarProducto(mockProducto);
    await service.agregarProducto(mockProducto2);

    expect((await service.carrito$.toPromise()).length).toBe(2);

    await service.eliminarProducto(mockProducto);

    service.carrito$.subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].producto.id).toBe(2);
    });
  });

  // TC-FE-018: Cálculo de subtotal e impuestos
  it('TC-FE-018: debe calcular total correctamente con impuestos', async () => {
    // Producto: $100, Descuento 10% = $90, IVA 15% = +$13.50 = $103.50
    await service.agregarProducto(mockProducto);
    await service.agregarProducto(mockProducto); // x2 = $207.00

    const total = service.getTotal();

    expect(total).toBeCloseTo(207.00, 2);
  });

  // TC-FE-019: Cálculo con productos mixtos (con/sin IVA)
  it('TC-FE-019: debe calcular correctamente con productos mixtos', async () => {
    // Producto 1: $103.50 (con IVA)
    // Producto 2: $80.00 (sin IVA)
    // Total: $183.50
    await service.agregarProducto(mockProducto);
    await service.agregarProducto(mockProducto2);

    const total = service.getTotal();

    expect(total).toBeCloseTo(183.50, 2);
  });

  // TC-FE-020: Persistencia del carrito
  it('TC-FE-020: debe cargar carrito desde storage', async () => {
    const storedData = JSON.stringify([
      { producto: mockProducto, cantidad: 2 },
      { producto: mockProducto2, cantidad: 1 }
    ]);

    mockPreferences.get.and.returnValue(Promise.resolve({ value: storedData }));

    const newService = new CarritoService();
    await newService.cargarStorage();

    newService.carrito$.subscribe(items => {
      expect(items.length).toBe(2);
      expect(items[0].cantidad).toBe(2);
      expect(items[1].cantidad).toBe(1);
    });
  });

  // TC-FE-021: Vaciar carrito completo (v1.1.0)
  it('TC-FE-021: debe vaciar el carrito completamente', async () => {
    await service.agregarProducto(mockProducto);
    await service.agregarProducto(mockProducto2);

    await service.vaciarCarrito();

    service.carrito$.subscribe(items => {
      expect(items.length).toBe(0);
    });

    expect(Preferences.remove).toHaveBeenCalledWith({ key: 'carrito_compras' });
  });

  // TC-FE-022: Carrito vacío
  it('TC-FE-022: debe retornar total 0 con carrito vacío', () => {
    const total = service.getTotal();
    expect(total).toBe(0);
  });

  // Prueba adicional: getPrecioItemConDescuento
  it('debe calcular precio de item con descuento correctamente', async () => {
    await service.agregarProducto(mockProducto);
    
    service.carrito$.subscribe(items => {
      const precioItem = service.getPrecioItemConDescuento(items[0]);
      expect(precioItem).toBeCloseTo(103.50, 2);
    });
  });

  // Prueba de getSubtotal
  it('debe calcular subtotal sin impuestos', async () => {
    await service.agregarProducto(mockProducto); // Base $100 - 10% = $90
    
    const subtotal = service.getSubtotal();
    
    // Subtotal sin IVA debería ser $90
    expect(subtotal).toBeCloseTo(90, 2);
  });

  // Prueba de getImpuestos
  it('debe calcular solo los impuestos', async () => {
    await service.agregarProducto(mockProducto); // IVA = $13.50
    
    const impuestos = service.getImpuestos();
    
    expect(impuestos).toBeCloseTo(13.50, 2);
  });
});
