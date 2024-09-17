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

  displaySkills = false;
  displayLicenses = false;
  displaySkillForExperience = true;

  userSkills = [];

  constructor(public pageService : PageService,
    public userService : UserService,
    public helperService : HelperService,
    private router : Router) {
    
    
  }

  ngOnInit(){
    this.userService.$loggedUser.subscribe(res => {
      this.userSkills = res.skills;

      if(res.skills){
        this.displaySkills = true;
      }
      if(res.licensesAndCertifications){
        this.displayLicenses = true;
      }
    });
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
    } else if(window == 'license'){
      this.helperService.$dimBackground.next(true);
      this.helperService.$showAddLicenseWindow.next(true);
    } else if(window == 'skill'){
      this.helperService.$dimBackground.next(true);
      this.helperService.$showAddSkillWindow.next(true);
    }
  }

  getExperienceSkills(experience : any){
    let skillsForExperience : any[] = this.userSkills.filter((skill : any) => skill.description == experience.position + ' at ' + experience.company.name);

    if(skillsForExperience.length == 0){
      return '';
    } else if(skillsForExperience.length == 1){
      return skillsForExperience[0].name;
    } else if(skillsForExperience.length == 2){
      return skillsForExperience[0].name + ', ' + skillsForExperience[1].name;
    } else {
      return skillsForExperience[0].name + ', ' + skillsForExperience[1].name + ' and +' + (skillsForExperience.length - 2) + ' skills';
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
