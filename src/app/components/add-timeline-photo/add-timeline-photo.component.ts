import { Component, ElementRef, ViewChild } from '@angular/core';
import { HelperService } from '../../services/helper.service';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-timeline-photo',
  templateUrl: './add-timeline-photo.component.html',
  styleUrl: './add-timeline-photo.component.scss'
})
export class AddTimelinePhotoComponent {
  showAddBackgroundPhoto = false;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  selectedFile: File | null = null;
  isPreviewImage = false;
  displayedPreviewImage = '../../../assets/images/profileMisc/add-background-photo.png';

  constructor(public helperService : HelperService, public profileService : ProfileService, public userService : UserService, public router : Router) {
        
  }

  addTimelinePhoto(){
    this.helperService.$dimBackground.next(true);
    this.showAddBackgroundPhoto = true;
  }

  closeWindow(){
    this.helperService.$dimBackground.next(false);
    this.profileService.$showAddTimelineWindow.next(false);
    this.isPreviewImage = false;
    this.displayedPreviewImage = '../../../assets/images/profileMisc/add-background-photo.png';
  }

  triggerFileInput(){
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; 
      console.log('Selected file:', this.selectedFile);
      this.previewImage();
    }
  }

  previewImage(): void {
    if (!this.selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const imageUrl = e.target.result; 
      console.log('Image URL:', imageUrl);

      this.displayedPreviewImage = imageUrl;
      this.isPreviewImage = true;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  uploadBackgroundImage(){
    this.profileService.changeBackgroundImage({
      userId: this.userService.$loggedUser.value.id,
      imageData: this.displayedPreviewImage,
    }).subscribe(res => {
      this.userService.$loggedUser.value.profileDetails.bannerImage = res.imageUrl;
      this.userService.$loggedUser.subscribe(user => {
        console.log(user);
      });
      document.location.reload();
    });
  }
}
