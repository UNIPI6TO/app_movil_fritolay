import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoModalPage } from './carrito-modal.page';

describe('CarritoModalPage', () => {
  let component: CarritoModalPage;
  let fixture: ComponentFixture<CarritoModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CarritoModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
