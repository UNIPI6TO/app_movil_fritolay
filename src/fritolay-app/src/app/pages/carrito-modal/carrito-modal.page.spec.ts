import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { CarritoModalPage } from './carrito-modal.page';

describe('CarritoModalPage', () => {
  let component: CarritoModalPage;
  let fixture: ComponentFixture<CarritoModalPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarritoModalPage],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: ModalController,
          useValue: {
            dismiss: jasmine.createSpy('dismiss')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CarritoModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
