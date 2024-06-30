import { TestBed } from '@angular/core/testing';

import { AskedHolidayServiceService } from './asked-holiday-service.service';

describe('AskedHolidayServiceService', () => {
  let service: AskedHolidayServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AskedHolidayServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
