import { Component } from '@angular/core';
import { PageService } from '../../services/page.service';
import { UserService } from '../../services/user.service';
import { HelperService } from '../../services/helper.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-edit-experience',
  templateUrl: './edit-experience.component.html',
  styleUrl: './edit-experience.component.scss'
})
export class EditExperienceComponent {
  icons = [
    {
      name: 'Home',
      shape: 'M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7z',
    },
    {
      name: 'My Network',
      shape: 'M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z',
    },
    {
      name: 'Jobs',
      shape: 'M17 6V5a3 3 0 00-3-3h-4a3 3 0 00-3 3v1H2v4a3 3 0 003 3h14a3 3 0 003-3V6zM9 5a1 1 0 011-1h4a1 1 0 011 1v1H9zm10 9a4 4 0 003-1.38V17a3 3 0 01-3 3H5a3 3 0 01-3-3v-4.38A4 4 0 005 14z',
    },
    {
      name: 'Messaging',
      shape: 'M16 4H8a7 7 0 000 14h4v4l8.16-5.39A6.78 6.78 0 0023 11a7 7 0 00-7-7zm-8 8.25A1.25 1.25 0 119.25 11 1.25 1.25 0 018 12.25zm4 0A1.25 1.25 0 1113.25 11 1.25 1.25 0 0112 12.25zm4 0A1.25 1.25 0 1117.25 11 1.25 1.25 0 0116 12.25z',
    },
    {
      name: 'Notifications',
      shape: 'M22 19h-8.28a2 2 0 11-3.44 0H2v-1a4.52 4.52 0 011.17-2.83l1-1.17h15.7l1 1.17A4.42 4.42 0 0122 18zM18.21 7.44A6.27 6.27 0 0012 2a6.27 6.27 0 00-6.21 5.44L5 13h14z',
    },
  ];

  otherSimilarProfiles : any = [];
  peopleYouMayKnow : any = [];
  twoPages : any = [];
  buttonStates: { [key: number]: boolean } = {};
  userSkills = [];

  constructor(
    public pageService : PageService,
    public userService : UserService,
    public helperService : HelperService,
    public profileService : ProfileService) {

  }

  ngOnInit(){
    window.scrollTo(0, 0);

    this.userService.$loggedUser.subscribe(res => {
      this.userSkills = res.skills;
    });
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

  addExperience(){
    this.helperService.$dimBackground.next(true);
    this.helperService.$showAddExperienceWindow.next(true);
  }

  editExperience(experience : any){
    this.profileService.$editExperienceFormValues.next(experience);
    this.helperService.$dimBackground.next(true);
    this.helperService.$showEditExperienceWindow.next(true);
  }

  sendConnection(receiverId : number){
    this.userService.sendConnection(this.userService.$loggedUser.value.id, receiverId).subscribe(res => {
      this.buttonStates[receiverId] = true;
      console.log(res);
    });
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
