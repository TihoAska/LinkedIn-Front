import { Component } from '@angular/core';
import { HelperService } from '../../services/helper.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-language-window',
  templateUrl: './add-language-window.component.html',
  styleUrl: './add-language-window.component.scss'
})
export class AddLanguageWindowComponent {

  languageForm = new FormGroup({
    language: new FormControl('', Validators.required),
    proficiency: new FormControl('', Validators.required),
  });
  
  constructor(public helperService : HelperService, public profileService : ProfileService, public userService : UserService) {
    
  }

  closeWindow(){
    this.helperService.$dimBackground.next(false);
    this.helperService.$showAddLanguageWindow.next(false);
  }

  submitForm(){
    if(this.languageForm.valid){
      this.profileService.createLanguageForUser({
        userId: this.userService.$loggedUser.value.id,
        name: this.languageForm.value.language,
        proficiency: this.languageForm.value.proficiency,
      }).subscribe(res => {
        this.helperService.$dimBackground.next(false);
        this.helperService.$showAddLanguageWindow.next(false);
        this.profileService.getAllLanguagesByUserId(this.userService.$loggedUser.value.id).subscribe(languages => {
          this.userService.$loggedUser.value.languages = languages;
        });
      })
    }
  }
}
