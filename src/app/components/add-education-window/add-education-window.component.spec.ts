import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEducationWindowComponent } from './add-education-window.component';

describe('AddEducationWindowComponent', () => {
  let component: AddEducationWindowComponent;
  let fixture: ComponentFixture<AddEducationWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEducationWindowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEducationWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
