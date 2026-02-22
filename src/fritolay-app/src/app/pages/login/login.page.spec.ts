import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { LoginPage } from './login.page';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authService: jasmine.SpyObj<AuthService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let router: Router;
  let loadingCtrl: LoadingController;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login'], {
      authState$: of(false)
    });
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        LoadingController
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    router = TestBed.inject(Router);
    loadingCtrl = TestBed.inject(LoadingController);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TC-FE-001: Login exitoso con credenciales válidas
  it('TC-FE-001: debe navegar a catálogo después de login exitoso', async () => {
    authService.login.and.returnValue(Promise.resolve({ success: true }));
    spyOn(router, 'navigate');

    component.email = 'test@example.com';
    component.pass = '123456';

    await component.login();

    expect(authService.login).toHaveBeenCalledWith('test@example.com', '123456');
    expect(router.navigate).toHaveBeenCalledWith(['/catalogo']);
    expect(component.isLoading).toBeFalse();
  });

  // TC-FE-003: Login con credenciales incorrectas
  it('TC-FE-003: debe mostrar error con credenciales incorrectas', async () => {
    authService.login.and.returnValue(
      Promise.resolve({ success: false, message: 'Credenciales inválidas' })
    );
    spyOn(router, 'navigate');

    component.email = 'wrong@example.com';
    component.pass = 'wrongpass';

    await component.login();

    expect(toastService.show).toHaveBeenCalledWith('Credenciales inválidas', 3000, 'danger');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  // TC-FE-007: Validación de campos vacíos
  it('TC-FE-007: debe mostrar error si email está vacío', async () => {
    component.email = '';
    component.pass = '123456';

    await component.login();

    expect(toastService.show).toHaveBeenCalledWith(
      'Correo y contraseña son requeridos',
      2500,
      'warning'
    );
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('TC-FE-007b: debe mostrar error si contraseña está vacía', async () => {
    component.email = 'test@example.com';
    component.pass = '';

    await component.login();

    expect(toastService.show).toHaveBeenCalledWith(
      'Correo y contraseña son requeridos',
      2500,
      'warning'
    );
    expect(authService.login).not.toHaveBeenCalled();
  });

  // TC-FE-005: Persistencia de sesión
  it('TC-FE-005: debe redirigir a catálogo si ya hay sesión', () => {
    spyOn(router, 'navigate');
    
    // Simular que authState$ emite true (sesión activa)
    (authService as any).authState$ = of(true);
    
    component.ngOnInit();
    
    // El observable debe haber navegado
    expect(router.navigate).toHaveBeenCalledWith(['/catalogo']);
  });

  // Prueba de loading controller
  it('debe mostrar y ocultar loading durante login', async () => {
    const loadingSpy = jasmine.createSpyObj('HTMLIonLoadingElement', ['present', 'dismiss']);
    spyOn(loadingCtrl, 'create').and.returnValue(Promise.resolve(loadingSpy));
    authService.login.and.returnValue(Promise.resolve({ success: true }));

    component.email = 'test@example.com';
    component.pass = '123456';

    await component.login();

    expect(loadingCtrl.create).toHaveBeenCalledWith({ message: 'Iniciando sesión...' });
    expect(loadingSpy.present).toHaveBeenCalled();
    expect(loadingSpy.dismiss).toHaveBeenCalled();
  });

  // Prueba de isLoading flag
  it('debe establecer isLoading durante el proceso de login', async () => {
    authService.login.and.returnValue(Promise.resolve({ success: true }));
    
    expect(component.isLoading).toBeFalse();
    
    const loginPromise = component.login();
    expect(component.isLoading).toBeTrue();
    
    await loginPromise;
    expect(component.isLoading).toBeFalse();
  });
});
