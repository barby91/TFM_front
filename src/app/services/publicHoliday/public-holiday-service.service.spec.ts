import { TestBed } from '@angular/core/testing';

import { PublicHolidayServiceService } from './public-holiday-service.service';

describe('PublicHolidayServiceService', () => {
  let service: PublicHolidayServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicHolidayServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
