import { Component } from '@angular/core';
import { HelperService } from '../../services/helper.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { PageService } from '../../services/page.service';
import { UserService } from '../../services/user.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-edit-skill-window',
  templateUrl: './edit-skill-window.component.html',
  styleUrl: './edit-skill-window.component.scss'
})
export class EditSkillWindowComponent {

  skills : any[] = [];
  showQuery = false;
  companies = [];
  userExperiences : any[] = [];
  uniqueEducations : any[] = [];
  licenses : any[] = [];
  filteredSkills : any[] = [];
  educationCompanies : any[] = [];
  skillInputName : string = '';
  skillsToBeChecked : any[] = [];

  skillForm = new  FormGroup({
    skill: new FormControl('', Validators.required),
    experiences: new FormArray([]),
    educations: new FormArray([]),
    licenses: new FormArray([]),
    followSkill: new FormControl(false),
  });

  constructor(
    public helperService : HelperService, 
    public pageService : PageService, 
    public userService : UserService, 
    public profileService : ProfileService) {    
    
  }

  ngOnInit(){
    this.pageService.getAllCompanies().subscribe(res => {
      this.companies = res;
    });

    this.userService.$loggedUser.subscribe(res => {
      if(res){
        res.experience.forEach((experience : any) => {
          this.userExperiences.push({
            position: experience.position,
            company: this.companies.find((company : any) => company.id == experience.companyId),
          })
        });
  
        res.education.forEach((education : any) => {
          this.educationCompanies.push(education.name);
        });
  
        res.licensesAndCertifications.forEach((license : any) => {
          this.licenses.push(license);
        });
  
        this.uniqueEducations = [...new Set(this.educationCompanies)];
  
        this.profileService.$editSkillFormValues.subscribe(res => {
          if(Array.isArray(res)){
            this.skillsToBeChecked = [];
            this.skillForm.get('skill')?.setValue(res[0]?.name);
            res.forEach((skill : any) => {
              this.skillsToBeChecked.push(skill.description);
            });
            this.initializeFormArrays();
          }
        });
      }
    });

    this.profileService.getAllSkills().subscribe((skills : any) => {
      this.skills = skills;
    });
  }

  initializeFormArrays() {
    (this.skillForm.get('experiences') as FormArray).clear();
    (this.skillForm.get('educations') as FormArray).clear();
    (this.skillForm.get('licenses') as FormArray).clear();

    this.userExperiences.forEach(experience => {
      if(this.skillsToBeChecked.includes(experience.position) || this.skillsToBeChecked.includes(experience.position + ' at ' + experience.company.name)){
        (this.skillForm.get('experiences') as FormArray).push(new FormControl(true));
      } else{
        (this.skillForm.get('experiences') as FormArray).push(new FormControl(false));
      }
    });

    this.uniqueEducations.forEach(education => {
      if(this.skillsToBeChecked.includes(education)){
        (this.skillForm.get('educations') as FormArray).push(new FormControl(true));
      } else{
        (this.skillForm.get('educations') as FormArray).push(new FormControl(false));
      }
    });

    this.licenses.forEach(license => {
      if(this.skillsToBeChecked.includes(license.name)){
        (this.skillForm.get('licenses') as FormArray).push(new FormControl(true));
      } else {
        (this.skillForm.get('licenses') as FormArray).push(new FormControl(false));
      }
    })
  }

  onInputChange(event : any){
    const inputValue = (event.target as HTMLInputElement).value;

    if(inputValue == ""){
      this.showQuery = false;
    } else{
      this.showQuery = true;
      if (!inputValue.trim()) {
        this.filteredSkills = [];
      } else {
        this.filteredSkills = this.skills.filter((skill : any) =>
          skill.name.toLowerCase().includes(inputValue.toLowerCase())
        );
      }
    }
  }

  select(skill : any){

  }

  closeWindow(){
    this.helperService.$dimBackground.next(false);
    this.helperService.$showEditSkillWindow.next(false);
  }

  submitForm(){
    if(this.skillForm.valid){

    }
  }
}
