import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AproveAskedHolidayComponent } from './aprove-asked-holiday.component';

describe('AproveAskedHolidayComponent', () => {
  let component: AproveAskedHolidayComponent;
  let fixture: ComponentFixture<AproveAskedHolidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AproveAskedHolidayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AproveAskedHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
