import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAskedHolidaysComponent } from './show-asked-holidays.component';

describe('ShowAskedHolidaysComponent', () => {
  let component: ShowAskedHolidaysComponent;
  let fixture: ComponentFixture<ShowAskedHolidaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowAskedHolidaysComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowAskedHolidaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
