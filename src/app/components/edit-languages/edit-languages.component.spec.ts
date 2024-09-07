import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLanguagesComponent } from './edit-languages.component';

describe('EditLanguagesComponent', () => {
  let component: EditLanguagesComponent;
  let fixture: ComponentFixture<EditLanguagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditLanguagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditLanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
