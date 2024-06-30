import { TestBed } from '@angular/core/testing';

import { CommonUnityService } from './common-unity.service';

describe('CommonUnityService', () => {
  let service: CommonUnityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonUnityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
