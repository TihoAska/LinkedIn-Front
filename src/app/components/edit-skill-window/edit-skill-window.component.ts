import { AddLicensesWindowComponent } from './../add-licenses-window/add-licenses-window.component';
import { Component } from '@angular/core';
import { HelperService } from '../../services/helper.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { PageService } from '../../services/page.service';
import { UserService } from '../../services/user.service';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';

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
  userSkills : any[] = [];

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
    public profileService : ProfileService,
    public router : Router) {    
    
  }

  ngOnInit(){
    this.pageService.getAllCompanies().subscribe(res => {
      this.companies = res;
    });

    this.userService.$loggedUser.subscribe(res => {
      if(res && res.experience && res.education && res.licensesAndCertifications){
        this.userSkills = res.skills;

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

  deleteSkill(){
    let deleteRequests : any = [];

    this.profileService.$editSkillFormValues.subscribe(res => {
      res.forEach((skill : any) => {
        console.log(skill);
        deleteRequests.push(
          this.profileService.deleteUserSkill(skill.userId, skill.name, skill.description)
          .pipe(catchError(err => {
            console.error(err);
            return of(null);
          })));
      });

      forkJoin(deleteRequests).subscribe(res => {
        console.log(res);
        this.helperService.$dimBackground.next(false);
        this.helperService.$showEditSkillWindow.next(false);
        window.location.reload();
      });
    })
  }

  closeWindow(){
    this.helperService.$dimBackground.next(false);
    this.helperService.$showEditSkillWindow.next(false);
    this.showQuery = false;
  }

  submitForm(){
    if(this.skillForm.valid){

      const experiencesArray = this.skillForm.get('experiences') as FormArray;
      const educationsArray = this.skillForm.get('educations') as FormArray;
      const licensesArray = this.skillForm.get('licenses') as FormArray;

      let preSelectedExperiences : any[] = [];
      let formattedUserExperiences : any[] = [];
      let formattedLicenses : any[] = [];

      let trueFalseValues = [];
      let allCheckboxes = [];

      let requests = [];

      this.profileService.$editSkillFormValues.value.forEach((skill : any) => {
        preSelectedExperiences.push(skill.description);
      });

      this.userExperiences.forEach(userExperience => {
        formattedUserExperiences.push(userExperience.position + ' at ' + userExperience.company.name);
      });

      this.licenses.forEach(license => {
        formattedLicenses.push(license.name)
      })

      const selectedExperiences = experiencesArray.value
        .map((checked: boolean, i: number) => checked ? this.userExperiences[i] : null)
        .filter((value: any) => value !== null);

      const selectedEducations = educationsArray.value
        .map((checked: boolean, i: number) => checked ? this.uniqueEducations[i] : null)
        .filter((value: any) => value !== null);
      
      const selectedLicenses = licensesArray.value
        .map((checked: boolean, i: number) => checked ? this.licenses[i] : null)
        .filter((value: any) => value !== null);


      let formattedSelectedLicenses : any[] = [];
      let formatedSelectedExperiences : any[] = [];

      selectedExperiences.forEach((selectedExperience : any) => {
        formatedSelectedExperiences.push(selectedExperience.position + ' at ' + selectedExperience.company.name);
      });

      selectedLicenses.forEach((selectedLicense : any) => {
        formattedSelectedLicenses.push(selectedLicense.name)
      });

      let selectedValues = [...formatedSelectedExperiences, ...selectedEducations, ...formattedSelectedLicenses];

      trueFalseValues = [...experiencesArray.value, ...educationsArray.value, ...licensesArray.value]
      allCheckboxes = [...formattedUserExperiences, ...this.uniqueEducations, ...formattedLicenses];

      for (let i = 0; i < trueFalseValues.length; i++) {
        if(trueFalseValues[i] == true){
          if(preSelectedExperiences.includes(allCheckboxes[i])){
            console.log('lelz');
          } else {
            let skillDomain;

            if(this.uniqueEducations.includes(allCheckboxes[i])){
              skillDomain = allCheckboxes[i];
            } else if(this.licenses.find(license => license.name == allCheckboxes[i])){
              skillDomain = this.licenses.find(license => license.name == allCheckboxes[i]).issuingOrganization;
            } else {
              this.userExperiences.forEach(userExperience => {
                if((userExperience.position + ' at ' + userExperience.company.name) == allCheckboxes[i]){
                  skillDomain = userExperience.company.name;
                }
              })
            }

            requests.push(
              this.profileService.createSkillForUser({
                userId: this.userService.$loggedUser.value.id,
                name: this.profileService.$editSkillFormValues.value[0].name,
                description: allCheckboxes[i],
                skillDomain: skillDomain,
              }).pipe(catchError(err => {
                console.error(err);
                return of(null);
              }))
            );
          }
        } else {
          if(preSelectedExperiences.includes(allCheckboxes[i])) {
            requests.push(
              this.profileService.deleteUserSkill(
                this.userService.$loggedUser.value.id,
                this.profileService.$editSkillFormValues.value[0].name,
                allCheckboxes[i]
              ).pipe(catchError(err => {
                console.error(err);
                return of(null);
              }))
            );
          }
        }
      }

      forkJoin(requests).subscribe(responses => {
        console.log('All requests completed', responses);
        window.location.reload();
      });
    }
  }
}
