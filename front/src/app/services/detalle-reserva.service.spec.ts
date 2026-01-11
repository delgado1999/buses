import { TestBed } from '@angular/core/testing';

import { DetalleReservaService } from './detalle-reserva.service';

describe('DetalleReservaService', () => {
  let service: DetalleReservaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleReservaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
