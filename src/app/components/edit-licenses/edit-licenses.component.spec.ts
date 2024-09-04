import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLicensesComponent } from './edit-licenses.component';

describe('EditLicensesComponent', () => {
  let component: EditLicensesComponent;
  let fixture: ComponentFixture<EditLicensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditLicensesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditLicensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
