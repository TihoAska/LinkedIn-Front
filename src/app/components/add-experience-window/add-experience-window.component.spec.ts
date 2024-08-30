import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExperienceWindowComponent } from './add-experience-window.component';

describe('AddExperienceComponent', () => {
  let component: AddExperienceWindowComponent;
  let fixture: ComponentFixture<AddExperienceWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddExperienceWindowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddExperienceWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
