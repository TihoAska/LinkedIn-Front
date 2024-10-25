import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { HelperService } from '../../services/helper.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-edit-licenses',
  templateUrl: './edit-licenses.component.html',
  styleUrl: './edit-licenses.component.scss'
})
export class EditLicensesComponent {

  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  constructor(public userService : UserService, public helperService : HelperService, public profileService : ProfileService
  ) {
      
  }

  ngOnInit(){
    window.scrollTo(0, 0);
  }

  addLicense(){
    this.helperService.$dimBackground.next(true);
    this.helperService.$showAddLicenseWindow.next(true);
  }

  public getMonthFromDateObject(date : any){
    let issueDate = new Date(date);
    return this.months[issueDate.getMonth()];
  }

  public getYearFromDateObject(date : any){
    let issueDate = new Date(date);
    return issueDate.getFullYear();
  }
  
  editLicense(license : any){
    this.helperService.$dimBackground.next(true);
    this.helperService.$showEditLicenseWindow.next(true);
    this.profileService.$editLicenseFormValues.next(license);
  }
}
