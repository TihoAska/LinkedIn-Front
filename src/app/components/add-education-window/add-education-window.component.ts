import { Component } from '@angular/core';
import { HelperService } from '../../services/helper.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-education-window',
  templateUrl: './add-education-window.component.html',
  styleUrl: './add-education-window.component.scss'
})
export class AddEducationWindowComponent {

  years : any[] = [];
  showSchoolImage = false;

  showQuery = false;
  showSchoolQuery = false;

  schools : any = [];
  filteredSchools : School[] = [];

  searchControl = new FormControl();
  searchSchoolControl = new FormControl();

  educationForm = new FormGroup({
    school: new FormControl('', Validators.required),
    degree: new FormControl('', Validators.required),
    fieldOfStudy: new FormControl('', Validators.required),
    startDateMonth: new FormControl('', Validators.required),
    startDateYear: new FormControl('Year', Validators.required),
    endDateMonth: new FormControl(''),
    endDateYear: new FormControl('Year'),
    grade: new FormControl(''),
    activitiesAndSocieties: new FormControl(''),
    description: new FormControl('')
  });

  constructor(
    public helperService : HelperService, 
    public profileService : ProfileService, 
    public userService : UserService) {
    
  }

  ngOnInit(){
    this.years.push('Year');
    for (let index = 2024; index > 1923; index--) {
      this.years.push(index);
    }

    this.profileService.getAllInstitutions().subscribe(res => {
      this.schools = res;
    })
  }

  closeWindow(){
    this.helperService.$dimBackground.next(false);
    this.helperService.$showAddEducationWindow.next(false);
  }

  select(school : any){
    this.showSchoolQuery = false;
    this.educationForm.patchValue({
      school: school.name,
    });
  }

  onInputChange(event : any){
    const inputValue = (event.target as HTMLInputElement).value;
    this.filteredSchools = this.schools.filter((location : any) =>
      location.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    if(inputValue == ""){
      this.showSchoolImage = false;
      this.showSchoolQuery = false;
    } else {
      this.filteredSchools.forEach(company => {
        if(company.name != inputValue){
          const selectedCompanyImage = document.querySelector<HTMLImageElement>('#selected-company-in-input');
  
          if (selectedCompanyImage) {
            selectedCompanyImage.src = '../../../assets/images/pageLogos/default-experience.png';
          }
        }
      });
  
      this.showSchoolQuery = true;
      if (!inputValue.trim()) {
        this.filteredSchools = [];
      } else {
        this.filteredSchools = this.schools.filter((location : any) =>
          location.name.toLowerCase().includes(inputValue.toLowerCase())
        );
      }
    }
  }

  submitForm(){
    if(this.educationForm.valid){
      this.profileService.createEducationForUser({
        userId: this.userService.$loggedUser.value.id,
        name: this.educationForm.value.school,
        degree: this.educationForm.value.degree,
        fieldOfStudy: this.educationForm.value.fieldOfStudy,
        startTime: this.educationForm.value.startDateYear + '-' + this.educationForm.value.startDateMonth + '-1T00:00:00.000Z',
        endTime: this.educationForm.value.endDateYear + '-' + this.educationForm.value.endDateMonth + '-1T00:00:00.000Z',
        // grade: this.educationForm.value.grade,
        // activitiesAndSocieties: this.educationForm.value.activitiesAndSocieties,
        // description: this.educationForm.value.description,
      }).subscribe(res => {
        this.helperService.$dimBackground.next(false);
        this.helperService.$showAddEducationWindow.next(false);
        this.profileService.getAllEducationsForUser(this.userService.$loggedUser.value.id).subscribe(ed => {
          ed.sort((a : any, b : any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
          this.userService.$loggedUser.value.education = ed;
        },
        error => console.log(error));
      });
    }
  }
}

export interface School {
  schoolImageUrl : string,
  name: string,
}