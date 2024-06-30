import { TestBed } from '@angular/core/testing';

import { OnGuardServiceService } from './on-guard-service.service';

describe('OnGuardServiceService', () => {
  let service: OnGuardServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnGuardServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
