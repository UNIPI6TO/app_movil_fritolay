import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth';
import { ApiService } from './api.service';
import { Preferences } from '@capacitor/preferences';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let apiService: ApiService;

  // Mock de Preferences de Capacitor
  const mockPreferences = {
    get: jasmine.createSpy('get').and.returnValue(Promise.resolve({ value: null })),
    set: jasmine.createSpy('set').and.returnValue(Promise.resolve()),
    remove: jasmine.createSpy('remove').and.returnValue(Promise.resolve())
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService, ApiService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiService);

    // Reemplazar Preferences con el mock
    spyOn(Preferences, 'get').and.callFake(mockPreferences.get);
    spyOn(Preferences, 'set').and.callFake(mockPreferences.set);
    spyOn(Preferences, 'remove').and.callFake(mockPreferences.remove);
  });

  afterEach(() => {
    httpMock.verify(); // Verificar que no haya peticiones pendientes
  });

  // TC-FE-001: Login exitoso con credenciales válidas
  it('TC-FE-001: debe loguearse correctamente con credenciales válidas', async () => {
    const mockResponse = {
      tokenAcceso: 'mock-jwt-token-12345',
      nombreUsuario: 'Juan Pérez',
      correo: 'juan@example.com',
      idUsuario: 42
    };

    const loginPromise = service.login('juan@example.com', '123456');

    // Simular respuesta del backend
    const req = httpMock.expectOne(`${environment.apiUrl}api/ControladorCuenta/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      CorreoElectronico: 'juan@example.com',
      Contrasena: '123456'
    });
    req.flush(mockResponse);

    const result = await loginPromise;

    // Verificaciones
    expect(result.success).toBeTrue();
    expect(Preferences.set).toHaveBeenCalledWith({ key: 'auth_token', value: 'mock-jwt-token-12345' });
    expect(Preferences.set).toHaveBeenCalledWith({ key: 'user_name', value: 'Juan Pérez' });
    expect(Preferences.set).toHaveBeenCalledWith({ key: 'user_email', value: 'juan@example.com' });
    expect(Preferences.set).toHaveBeenCalledWith({ key: 'user_id', value: '42' });
  });

  // TC-FE-003: Login con credenciales incorrectas
  it('TC-FE-003: debe retornar error con credenciales incorrectas', async () => {
    const errorResponse = { mensaje: 'Credenciales inválidas' };

    const loginPromise = service.login('wrong@example.com', 'wrongpass');

    const req = httpMock.expectOne(`${environment.apiUrl}api/ControladorCuenta/login`);
    req.flush(errorResponse, { status: 401, statusText: 'Unauthorized' });

    const result = await loginPromise;

    expect(result.success).toBeFalse();
    expect(result.message).toBeTruthy();
    expect(Preferences.set).not.toHaveBeenCalled();
  });

  // TC-FE-005: Persistencia de sesión
  it('TC-FE-005: debe detectar sesión existente al iniciar', async () => {
    mockPreferences.get.and.returnValue(Promise.resolve({ value: 'existing-token' }));
    
    await service.checkSession();
    
    service.authState$.subscribe(isAuth => {
      expect(isAuth).toBeTrue();
    });
  });

  // TC-FE-006: Logout exitoso
  it('TC-FE-006: debe limpiar sesión al hacer logout', async () => {
    await service.logout();

    expect(Preferences.remove).toHaveBeenCalledWith({ key: 'auth_token' });
    expect(Preferences.remove).toHaveBeenCalledWith({ key: 'user_name' });
    expect(Preferences.remove).toHaveBeenCalledWith({ key: 'user_email' });
    expect(Preferences.remove).toHaveBeenCalledWith({ key: 'user_id' });
    
    service.authState$.subscribe(isAuth => {
      expect(isAuth).toBeFalse();
    });
  });

  // Registro de usuario
  it('debe registrar un usuario correctamente', async () => {
    const mockResponse = { mensaje: 'Usuario registrado exitosamente' };
    const datosRegistro = {
      Cedula: '1234567890',
      NombreCompleto: 'Juan Pérez',
      CorreoElectronico: 'juan@example.com',
      Contrasena: '123456',
      Telefono: '0987654321',
      Direccion: 'Calle 123'
    };

    const registerPromise = service.register(datosRegistro);

    const req = httpMock.expectOne(`${environment.apiUrl}api/ControladorCuenta/registrar`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(datosRegistro);
    req.flush(mockResponse);

    const result = await registerPromise;

    expect(result.success).toBeTrue();
    expect(result.message).toContain('Registro');
  });

  // Recuperación de contraseña
  it('debe enviar código de recuperación correctamente', async () => {
    const mockResponse = {
      mensaje: 'Código enviado',
      codigoDebug: '123456'
    };

    const recuperarPromise = service.recuperar('juan@example.com');

    const req = httpMock.expectOne(`${environment.apiUrl}api/ControladorCuenta/recuperar`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ CorreoElectronico: 'juan@example.com' });
    req.flush(mockResponse);

    const result = await recuperarPromise;

    expect(result.success).toBeTrue();
    expect(result.codigoDebug).toBe('123456');
  });

  // TC-FE-004: Login sin conexión a internet
  it('TC-FE-004: debe manejar error de conexión', async () => {
    const loginPromise = service.login('test@test.com', '123456');

    const req = httpMock.expectOne(`${environment.apiUrl}api/ControladorCuenta/login`);
    // Simular error de red (status 0)
    req.error(new ProgressEvent('error'), { status: 0, statusText: 'Network Error' });

    const result = await loginPromise;

    expect(result.success).toBeFalse();
    expect(result.message).toBeTruthy();
  });
});
