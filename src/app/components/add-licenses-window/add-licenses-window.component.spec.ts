import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLicensesWindowComponent } from './add-licenses-window.component';

describe('AddLicensesWindowComponent', () => {
  let component: AddLicensesWindowComponent;
  let fixture: ComponentFixture<AddLicensesWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddLicensesWindowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddLicensesWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
