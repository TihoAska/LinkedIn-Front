import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLanguageWindowComponent } from './add-language-window.component';

describe('AddLanguageWindowComponent', () => {
  let component: AddLanguageWindowComponent;
  let fixture: ComponentFixture<AddLanguageWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddLanguageWindowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddLanguageWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
