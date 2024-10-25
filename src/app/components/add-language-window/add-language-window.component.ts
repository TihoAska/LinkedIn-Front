import { Component } from '@angular/core';
import { HelperService } from '../../services/helper.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

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
  
  constructor(
    public helperService : HelperService, 
    public profileService : ProfileService, 
    public userService : UserService,
    public router : Router) {
    
  }

  closeWindow(){
    this.helperService.$dimBackground.next(false);
    this.helperService.$showAddLanguageWindow.next(false);
    this.resetForm();
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
        this.resetForm();
        this.userService.$loggedUser.value.languages = [...this.userService.$loggedUser.value.languages, res];
      });
    }
  }

  resetForm(){
    this.languageForm.reset({
      language: '',
      proficiency: '',
    });
  }
}
