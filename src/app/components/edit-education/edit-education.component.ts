import { ProfileService } from './../../services/profile.service';
import { HelperService } from './../../services/helper.service';
import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-education',
  templateUrl: './edit-education.component.html',
  styleUrl: './edit-education.component.scss'
})
export class EditEducationComponent {

  constructor(
    public userService : UserService, 
    public helperService : HelperService,
    public profileService : ProfileService) {
    
    
  }

  ngOnInit(){
    window.scrollTo(0, 0);
  }

  addEducation(){

  }

  editEducation(education : any){
    this.profileService.$editEducationFormValues.next(education);
    this.helperService.$dimBackground.next(true);
    this.helperService.$showEditEducationWindow.next(true);
  }

  getMonthDifference(startDate: Date, endDate: Date) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    let yearsDifference = end.getFullYear() - start.getFullYear();
    let monthsDifference = end.getMonth() - start.getMonth();
    
    if (monthsDifference < 0) {
      yearsDifference--;
      monthsDifference+=12;
    }
  
    let result = '';

    if (yearsDifference > 0) {
      result += `${yearsDifference} yr${yearsDifference > 1 ? 's' : ''}`;
    }
    if (monthsDifference > 0) {
      if (result) result += ' ';
      result += `${monthsDifference} mo${monthsDifference > 1 ? 's' : ''}`;
    }
  
    return result || '0 mos';
  }
}
