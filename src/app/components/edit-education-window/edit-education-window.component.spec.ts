import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEducationWindowComponent } from './edit-education-window.component';

describe('EditEducationWindowComponent', () => {
  let component: EditEducationWindowComponent;
  let fixture: ComponentFixture<EditEducationWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditEducationWindowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditEducationWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
