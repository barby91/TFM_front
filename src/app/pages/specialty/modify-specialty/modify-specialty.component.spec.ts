import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifySpecialtyComponent } from './modify-specialty.component';

describe('ModifySpecialtyComponent', () => {
  let component: ModifySpecialtyComponent;
  let fixture: ComponentFixture<ModifySpecialtyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifySpecialtyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifySpecialtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
