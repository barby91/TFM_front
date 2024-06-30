import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyCommonUnityComponent } from './modify-common-unity.component';

describe('ModifyCommonUnityComponent', () => {
  let component: ModifyCommonUnityComponent;
  let fixture: ComponentFixture<ModifyCommonUnityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyCommonUnityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifyCommonUnityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
