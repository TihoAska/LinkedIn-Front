import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HelperService } from '../../services/helper.service';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-language-window',
  templateUrl: './edit-language-window.component.html',
  styleUrl: './edit-language-window.component.scss'
})
export class EditLanguageWindowComponent {

  languageForm = new FormGroup({
    language: new FormControl('', Validators.required),
    proficiency: new FormControl('', Validators.required),
  });
  
  constructor(public helperService : HelperService, public profileService : ProfileService, public userService : UserService) {
     
  }

  ngOnInit(){
    this.profileService.$editLanguageFormValues.subscribe(res => {
      this.languageForm.setValue({
        language: res.name,
        proficiency: res.proficiency,
      })
    })
  }

  submitForm(){
    if(this.languageForm.valid){
      this.profileService.editLanguageForUser({
        id: this.profileService.$editLanguageFormValues.value.id,
        name: this.languageForm.value.language,
        proficiency: this.languageForm.value.proficiency,
      }).subscribe(res => {
        this.helperService.$dimBackground.next(false);
        this.helperService.$showEditLanguageWindow.next(false);
        this.profileService.getAllLanguagesByUserId(this.userService.$loggedUser.value.id).subscribe(res => {
          this.userService.$loggedUser.value.languages = res;
        });
      });
    }
  }

  closeWindow(){
    this.helperService.$dimBackground.next(false);
    this.helperService.$showEditLanguageWindow.next(false);
  }
}
