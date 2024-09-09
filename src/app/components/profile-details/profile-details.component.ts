import { Component } from '@angular/core';
import { PageService } from '../../services/page.service';
import { UserService } from '../../services/user.service';
import { HelperService } from '../../services/helper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.scss'
})
export class ProfileDetailsComponent {

  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  constructor(public pageService : PageService,
    public userService : UserService,
    public helperService : HelperService,
    private router : Router) {
    
    
  }

  toggleWindow(window : any){
    if(window == 'education'){
      this.helperService.$dimBackground.next(true);
      this.helperService.$showAddEducationWindow.next(true);
    } else if(window == 'experience'){
      this.helperService.$dimBackground.next(true);
      this.helperService.$showAddExperienceWindow.next(true);
    } else if(window == 'language'){
      this.helperService.$dimBackground.next(true);
      this.helperService.$showAddLanguageWindow.next(true);
    }
  }

  edit(location : any){
    this.router.navigate(['your-profile', location]);
  }

  public getMonthFromDateObject(date : any){
    let issueDate = new Date(date);
    return this.months[issueDate.getMonth()];
  }

  public getYearFromDateObject(date : any){
    let issueDate = new Date(date);
    return issueDate.getFullYear();
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
