import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimelinePhotoComponent } from './add-timeline-photo.component';

describe('AddTimelinePhotoComponent', () => {
  let component: AddTimelinePhotoComponent;
  let fixture: ComponentFixture<AddTimelinePhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTimelinePhotoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTimelinePhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
