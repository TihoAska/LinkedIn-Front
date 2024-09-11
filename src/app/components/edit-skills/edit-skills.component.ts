import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { HelperService } from '../../services/helper.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-edit-skills',
  templateUrl: './edit-skills.component.html',
  styleUrl: './edit-skills.component.scss'
})
export class EditSkillsComponent {

  skills : any[] = [];
  uniqueSkillCategories : any[] = [];
  skillCategories : any[] = [];
  
  constructor(public userService : UserService, public helperService : HelperService, public profileService : ProfileService) {  
    
  }

  ngOnInit(){
    window.scrollTo(0, 0);

    this.userService.$loggedUser.subscribe(res => {
      if(res){
        res.skills.forEach((skill : any) => {
          this.skills.push(skill.name);
        });
  
        this.uniqueSkillCategories = [...new Set(this.skills)];
  
        for (let i = 0; i < this.uniqueSkillCategories.length; i++) {
          let tempSkills : any[] = [];
          res.skills.forEach((skill : any) => {
            if(this.uniqueSkillCategories[i] == skill.name){
              tempSkills.push(skill);
            }
          });
          this.skillCategories.push(tempSkills); 
        }
      }
    });
  }

  addSkill(){
    this.helperService.$dimBackground.next(true);
    this.helperService.$showAddSkillWindow.next(true);
  }

  editSkill(skill : any){
    this.helperService.$dimBackground.next(true);
    this.helperService.$showEditSkillWindow.next(true);
    this.profileService.$editSkillFormValues.next(skill);
  }
}
