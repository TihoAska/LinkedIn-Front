import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLanguageWindowComponent } from './edit-language-window.component';

describe('EditLanguageWindowComponent', () => {
  let component: EditLanguageWindowComponent;
  let fixture: ComponentFixture<EditLanguageWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditLanguageWindowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditLanguageWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
