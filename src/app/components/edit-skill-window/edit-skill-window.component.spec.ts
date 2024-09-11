import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSkillWindowComponent } from './edit-skill-window.component';

describe('EditSkillWindowComponent', () => {
  let component: EditSkillWindowComponent;
  let fixture: ComponentFixture<EditSkillWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditSkillWindowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditSkillWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
