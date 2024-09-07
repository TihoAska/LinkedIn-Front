import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { HelperService } from '../../services/helper.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-edit-languages',
  templateUrl: './edit-languages.component.html',
  styleUrl: './edit-languages.component.scss'
})
export class EditLanguagesComponent {

  constructor(public userService : UserService, public helperService : HelperService, public profileService : ProfileService) {
    
  }

  ngOnInit(){
    window.scrollTo(0, 0);
  }

  addLanguage(){

  }

  editLanguage(language : any){
    this.helperService.$dimBackground.next(true);
    this.helperService.$showEditLanguageWindow.next(true);
    this.profileService.$editLanguageFormValues.next(language);
  }
}
