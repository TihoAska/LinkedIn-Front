import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  $dimBackground : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  $showAddExperienceWindow : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  $showEditExperienceWindow : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  $showProfile : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  $editingExperienceId : BehaviorSubject<number> = new BehaviorSubject<number>(-1);

  constructor() { }
}
