import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleReservaListComponent } from './detalle-reserva-list.component';

describe('DetalleReservaListComponent', () => {
  let component: DetalleReservaListComponent;
  let fixture: ComponentFixture<DetalleReservaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleReservaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleReservaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
