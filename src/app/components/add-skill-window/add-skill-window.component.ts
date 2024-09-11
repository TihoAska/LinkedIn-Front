import { MatIconModule } from '@angular/material/icon';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { HelperService } from '../../services/helper.service';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';
import { PageService } from '../../services/page.service';
import exp from 'constants';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-add-skill-window',
  templateUrl: './add-skill-window.component.html',
  styleUrl: './add-skill-window.component.scss'
})
export class AddSkillWindowComponent {

  skills : any[] = [];
  filteredSkills : any[] = [];
  showQuery = false;
  experiencesAndCompanies = [];
  companies = [];
  experiences : any[] = [];
  uniqueEducations : any[] = [];
  licenses : any[] = [];
  educationCompanies : any[] = [];

  hasExperienceResponded = false;
  hasLicensesResponded = false;
  hasEducationResponded = false;

  displayError = false;
  errorMessage = '';

  skillForm = new  FormGroup({
    skill: new FormControl('', Validators.required),
    experiences: new FormArray([]),
    educations: new FormArray([]),
    licenses: new FormArray([]),
    followSkill: new FormControl(false),
  });

  constructor(public helperService : HelperService, public profileService : ProfileService, public userService : UserService, public pageService : PageService) {
    
  }

  ngOnInit(){
    this.pageService.getAllCompanies().subscribe(res => {
      this.companies = res;
    });

    this.userService.$loggedUser.subscribe(res => {
      res.experience.forEach((experience : any) => {
        this.experiences.push({
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

      this.initializeFormArrays();
    });

    this.profileService.getAllSkills().subscribe((skills : any) => {
      this.skills = skills;
    });
  }

  initializeFormArrays() {
    (this.skillForm.get('experiences') as FormArray).clear();
    (this.skillForm.get('educations') as FormArray).clear();
    (this.skillForm.get('licenses') as FormArray).clear();

    this.experiences.forEach(() => {
      (this.skillForm.get('experiences') as FormArray).push(new FormControl(false));
    });

    this.uniqueEducations.forEach(() => {
      (this.skillForm.get('educations') as FormArray).push(new FormControl(false));
    });

    this.licenses.forEach(() => {
      (this.skillForm.get('licenses') as FormArray).push(new FormControl(false));
    })
  }

  submitForm() {
    if(this.skillForm.valid){
      const experiencesArray = this.skillForm.get('experiences') as FormArray;
      const educationsArray = this.skillForm.get('educations') as FormArray;
      const licensesArray = this.skillForm.get('licenses') as FormArray;

      let experienceObservables;
      let educationObservables;
      let licenseObservables;
  
      const selectedExperiences = experiencesArray.value
        .map((checked: boolean, i: number) => checked ? this.experiences[i] : null)
        .filter((value: any) => value !== null);
  
      const selectedEducations = educationsArray.value
        .map((checked: boolean, i: number) => checked ? this.uniqueEducations[i] : null)
        .filter((value: any) => value !== null);
      
      const selectedLicenses = licensesArray.value
        .map((checked: boolean, i: number) => checked ? this.licenses[i] : null)
        .filter((value: any) => value !== null);


      if(selectedExperiences.length > 0){
        experienceObservables = selectedExperiences.map((experience: any) => 
          this.profileService.createSkillForUser({
            userId: this.userService.$loggedUser.value.id,
            name: this.skillForm.value.skill,
            description: experience.position + ' at ' + experience.company.name,
            skillDomain: experience.company.name,
          })
        );
      }

      if(selectedEducations.length > 0){
        educationObservables = selectedEducations.map((element: any) =>
          this.profileService.createSkillForUser({
            userId: this.userService.$loggedUser.value.id,
            name: this.skillForm.value.skill,
            description: element,
            skillDomain: element,
          })
        );
      }

      if(selectedLicenses.length > 0){
        licenseObservables = selectedLicenses.map((element: any) =>
          this.profileService.createSkillForUser({
            userId: this.userService.$loggedUser.value.id,
            name: this.skillForm.value.skill,
            description: element.name,
            skillDomain: element.issuingOrganization,
          })
        );
      }

      forkJoin({
        experiences: experienceObservables?.length > 0 ? forkJoin(experienceObservables) : of([]),
        educations: educationObservables?.length > 0 ? forkJoin(educationObservables) : of([]),
        licenses: licenseObservables?.length > 0 ? forkJoin(licenseObservables) : of([]),
      }).subscribe(responses => {
          console.log(responses);
          this.helperService.$dimBackground.next(false);
          this.helperService.$showAddSkillWindow.next(false);

          this.userService.getUserByIdWithUserDetails(this.userService.$loggedUser.value.id).subscribe(res => {
            this.userService.$loggedUser.value.skills = res.skills;
          });
      }, error => {
        console.log(error.error.Message);
        this.helperService.$errorMessage.next(error.error.Message);
        this.helperService.$displayError.next(true);
      });
    }
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
    this.showQuery = false;
    this.skillForm.patchValue({
      skill: skill.name,
    })
  }

  closeWindow(){
    this.helperService.$dimBackground.next(false);
    this.helperService.$showAddSkillWindow.next(false);
    this.showQuery = false;
    this.skillForm.reset();
  }
}
