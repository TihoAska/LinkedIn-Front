import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  $dimBackground: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  $showProfile: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  $editingExperienceId: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  
  $showAddExperienceWindow: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  $showEditExperienceWindow: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  $showAddEducationWindow: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  $showEditEducationWindow: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  $showAddLicenseWindow: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  $showEditLicenseWindow: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  $showAddLanguageWindow: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  $showEditLanguageWindow: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  $showAddSkillWindow: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  $showEditSkillWindow: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  $displayError: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  $errorMessage: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public showRedDots = [false, false, false, false, false];

  constructor() { }

  getFullImagePath(imageUrl : string){
    if(!environment.production){
      return environment.baseUrl + imageUrl;
    }
    return '';
  }
}
