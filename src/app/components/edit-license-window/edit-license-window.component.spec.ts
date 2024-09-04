import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLicenseWindowComponent } from './edit-license-window.component';

describe('EditLicenseWindowComponent', () => {
  let component: EditLicenseWindowComponent;
  let fixture: ComponentFixture<EditLicenseWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditLicenseWindowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditLicenseWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
