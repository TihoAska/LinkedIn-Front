import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExperienceWindowComponent } from './edit-experience-window.component';

describe('EditExperienceWindowComponent', () => {
  let component: EditExperienceWindowComponent;
  let fixture: ComponentFixture<EditExperienceWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditExperienceWindowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditExperienceWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
