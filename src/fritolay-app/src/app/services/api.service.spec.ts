import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // TC-FE-042: cleanObject() elimina undefined (v1.1.0)
  it('TC-FE-042: debe eliminar propiedades undefined', async () => {
    const testObj = {
      nombre: 'Juan',
      apellido: undefined,
      edad: 30
    };

    const url = 'http://test.com/api/test';
    const postPromise = service.post(url, testObj);

    const req = httpMock.expectOne(url);
    
    // Verificar que el body no contiene 'apellido'
    expect(req.request.body).toEqual({
      nombre: 'Juan',
      edad: 30
    });
    expect(req.request.body.hasOwnProperty('apellido')).toBeFalse();

    req.flush({ success: true });
    await postPromise;
  });

  // TC-FE-043: cleanObject() elimina null (v1.1.0)
  it('TC-FE-043: debe eliminar propiedades null', async () => {
    const testObj = {
      nombre: 'Juan',
      referencia: null,
      edad: 30
    };

    const url = 'http://test.com/api/test';
    const postPromise = service.post(url, testObj);

    const req = httpMock.expectOne(url);
    
    expect(req.request.body).toEqual({
      nombre: 'Juan',
      edad: 30
    });
    expect(req.request.body.hasOwnProperty('referencia')).toBeFalse();

    req.flush({ success: true });
    await postPromise;
  });

  // TC-FE-044: cleanObject() recursivo (v1.1.0)
  it('TC-FE-044: debe limpiar objetos anidados recursivamente', async () => {
    const testObj = {
      usuario: {
        nombre: 'Juan',
        apellido: undefined,
        direccion: {
          calle: 'Av. Principal',
          numero: null,
          ciudad: 'Quito'
        }
      },
      activo: true
    };

    const url = 'http://test.com/api/test';
    const postPromise = service.post(url, testObj);

    const req = httpMock.expectOne(url);
    
    const expectedBody = {
      usuario: {
        nombre: 'Juan',
        direccion: {
          calle: 'Av. Principal',
          ciudad: 'Quito'
        }
      },
      activo: true
    };

    expect(req.request.body).toEqual(expectedBody);

    req.flush({ success: true });
    await postPromise;
  });

  // TC-FE-045: cleanObject() con arrays (v1.1.0)
  it('TC-FE-045: debe limpiar arrays con objetos', async () => {
    const testObj = {
      productos: [
        { id: 1, nombre: 'Producto A', precio: undefined },
        { id: 2, nombre: 'Producto B', precio: 100 }
      ]
    };

    const url = 'http://test.com/api/test';
    const postPromise = service.post(url, testObj);

    const req = httpMock.expectOne(url);
    
    const expectedBody = {
      productos: [
        { id: 1, nombre: 'Producto A' },
        { id: 2, nombre: 'Producto B', precio: 100 }
      ]
    };

    expect(req.request.body).toEqual(expectedBody);

    req.flush({ success: true });
    await postPromise;
  });

  // Prueba de método GET
  it('debe realizar peticiones GET correctamente', async () => {
    const url = 'http://test.com/api/productos';
    const mockResponse = [
      { id: 1, nombre: 'Producto 1' },
      { id: 2, nombre: 'Producto 2' }
    ];

    const getPromise = service.get(url);

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    const result = await getPromise;
    expect(result).toEqual(mockResponse);
  });

  // TC-FE-047: Manejo de errores 401
  it('TC-FE-047: debe manejar errores 401 Unauthorized', async () => {
    const url = 'http://test.com/api/test';
    
    try {
      const getPromise = service.get(url);
      const req = httpMock.expectOne(url);
      req.flush({ mensaje: 'No autorizado' }, { status: 401, statusText: 'Unauthorized' });
      
      await getPromise;
      fail('Debería haber lanzado un error');
    } catch (error: any) {
      expect(error.status).toBe(401);
      expect(error.friendlyMessage).toBeTruthy();
    }
  });

  // TC-FE-050: Timeout de peticiones HTTP
  it('TC-FE-050: debe manejar errores de timeout', async () => {
    const url = 'http://test.com/api/slow';
    
    try {
      const getPromise = service.get(url);
      const req = httpMock.expectOne(url);
      req.error(new ProgressEvent('timeout'), { status: 0, statusText: 'Timeout' });
      
      await getPromise;
      fail('Debería haber lanzado un error');
    } catch (error: any) {
      expect(error.friendlyMessage).toBeTruthy();
    }
  });

  // Prueba de extracción de mensaje de error
  it('debe extraer mensaje de error desde Blob', async () => {
    const url = 'http://test.com/api/test';
    const errorMessage = JSON.stringify({ mensaje: 'Error de validación' });
    const blob = new Blob([errorMessage], { type: 'application/json' });
    
    try {
      const postPromise = service.post(url, { test: 'data' });
      const req = httpMock.expectOne(url);
      req.flush(blob, { status: 400, statusText: 'Bad Request' });
      
      await postPromise;
      fail('Debería haber lanzado un error');
    } catch (error: any) {
      expect(error.friendlyMessage).toContain('Error');
    }
  });

  // Prueba de valores válidos que NO deben eliminarse
  it('no debe eliminar valores válidos (0, false, string vacío)', async () => {
    const testObj = {
      cantidad: 0,
      activo: false,
      comentario: '',
      nombre: 'Test'
    };

    const url = 'http://test.com/api/test';
    const postPromise = service.post(url, testObj);

    const req = httpMock.expectOne(url);
    
    // Todos los valores deben permanecer
    expect(req.request.body).toEqual({
      cantidad: 0,
      activo: false,
      comentario: '',
      nombre: 'Test'
    });

    req.flush({ success: true });
    await postPromise;
  });

  // Prueba de array vacío (debe mantenerse)
  it('debe mantener arrays vacíos', async () => {
    const testObj = {
      productos: [],
      nombre: 'Test'
    };

    const url = 'http://test.com/api/test';
    const postPromise = service.post(url, testObj);

    const req = httpMock.expectOne(url);
    
    expect(req.request.body).toEqual({
      productos: [],
      nombre: 'Test'
    });

    req.flush({ success: true });
    await postPromise;
  });
});
