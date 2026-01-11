import { TestBed } from '@angular/core/testing';

import { CuidadService } from './cuidad.service';

describe('CuidadService', () => {
  let service: CuidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
