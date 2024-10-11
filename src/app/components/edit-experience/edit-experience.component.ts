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
