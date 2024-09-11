import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSkillWindowComponent } from './add-skill-window.component';

describe('AddSkillWindowComponent', () => {
  let component: AddSkillWindowComponent;
  let fixture: ComponentFixture<AddSkillWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSkillWindowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSkillWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
