import { Component } from '@angular/core';
import { HelperService } from '../../services/helper.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-education-window',
  templateUrl: './edit-education-window.component.html',
  styleUrl: './edit-education-window.component.scss'
})
export class EditEducationWindowComponent {
  years : any[] = [];
  showSchoolImage = false;

  showQuery = false;
  showSchoolQuery = false;

  schools : any = [];
  filteredSchools : School[] = [];

  searchControl = new FormControl();
  searchSchoolControl = new FormControl();

  schoolImage = '';
  educationId = -1;

  educationForm = new FormGroup({
    school: new FormControl('', Validators.required),
    degree: new FormControl('', Validators.required),
    fieldOfStudy: new FormControl('', Validators.required),
    startDateMonth: new FormControl('', Validators.required),
    startDateYear: new FormControl('Year', Validators.required),
    endDateMonth: new FormControl(''),
    endDateYear: new FormControl('Year'),
    grade: new FormControl('grade'),
    activitiesAndSocieties: new FormControl(''),
    description: new FormControl('')
  });

  constructor(
    public helperService : HelperService,
    public profileService : ProfileService,
    public userService : UserService,
    public router : Router) {
    
  }

  ngOnInit(){
    this.years.push('Year');
    for (let index = 2024; index > 1923; index--) {
      this.years.push(index);
    }

    this.profileService.getAllInstitutions().subscribe(res => {
      this.schools = res;
    })

    this.profileService.$editEducationFormValues.subscribe(ef => {
      this.educationId = ef.id;
      let formattedDate = this.formatDate(ef);

      this.schoolImage = ef.schoolImageUrl;
      this.showSchoolImage = true;

      this.educationForm.patchValue({
        school: ef.name,
        degree: ef.degree,
        fieldOfStudy: ef.fieldOfStudy,
        grade: ef.grade,
        startDateMonth: formattedDate.startMonth,
        startDateYear: formattedDate.startYear.toString(),
        endDateMonth: formattedDate.endMonth,
        endDateYear: formattedDate.endYear.toString(),
      });
    });
  }

  formatDate(object : any){
    let startDate = new Date(object.startTime);
    let endDate = new Date(object.endTime);

    let startMonth = (startDate.getMonth() + 1).toString();
    let endMonth = (endDate.getMonth() + 1).toString();

    if(startMonth.length == 1){
      startMonth = "0" + startMonth; 
    }

    if(endMonth.length == 1){
      endMonth = "0" + endMonth;
    }

    return {
      startMonth: startMonth,
      startYear: startDate.getFullYear(),
      endMonth: endMonth,
      endYear: endDate.getFullYear(),
    }
  }

  select(school : any){
    this.showSchoolQuery = false;
    this.showSchoolImage = true;

    this.schoolImage = school.schoolImageUrl;

    this.educationForm.patchValue({
      school: school.name,
    });
  }

  closeWindow(){
    this.helperService.$dimBackground.next(false);
    this.helperService.$showEditEducationWindow.next(false);
    this.showSchoolImage = false;
    this.showSchoolQuery = false;
    this.educationForm.reset();
  }

  submitForm(){
    if(this.educationForm.valid){
      this.profileService.editEducationForUser({
        id: this.profileService.$editEducationFormValues.value.id,
        school: this.educationForm.value.school,
        degree: this.educationForm.value.degree,
        fieldOfStudy: this.educationForm.value.fieldOfStudy,
        startDate: this.educationForm.value.startDateYear + '-' + this.educationForm.value.startDateMonth + '-1T00:00:00.000Z',
        endDate: this.educationForm.value.endDateYear + '-' + this.educationForm.value.endDateMonth + '-1T00:00:00.000Z',
        grade: this.educationForm.value.grade,
        activitiesAndSocieties: this.educationForm.value.activitiesAndSocieties,
        description: this.educationForm.value.description,
      }).subscribe(res => {
        this.helperService.$dimBackground.next(false);
        this.helperService.$showEditEducationWindow.next(false);
        this.profileService.getAllEducationsForUser(this.userService.$loggedUser.value.id).subscribe(ed => {
          this.userService.$loggedUser.next({
            ...this.userService.$loggedUser.value,
            education: ed,
          });
        },
        error => console.log(error));
      });
    }
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
          this.schoolImage = '../../../assets/images/pageLogos/default-experience.png';
        }
      });
  
      this.showSchoolQuery = true;
      this.showSchoolImage = true;
      if (!inputValue.trim()) {
        this.filteredSchools = [];
      } else {
        this.filteredSchools = this.schools.filter((location : any) =>
          location.name.toLowerCase().includes(inputValue.toLowerCase())
        );
      }
    }
  }

  deleteEducation(){
    if(this.educationId != -1){
      this.profileService.deleteEducationForUser({
        userId: this.userService.$loggedUser.value.id,
        educationId: this.educationId,
      }).subscribe(res => {
        this.showSchoolImage = false;
        console.log(res);
        this.helperService.$showEditEducationWindow.next(false);
        this.helperService.$dimBackground.next(false);

        this.profileService.getAllEducationsForUser(this.userService.$loggedUser.value.id).subscribe(education => {
          education.sort((a : any, b : any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
          this.userService.$loggedUser.value.education = education;

          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate(['your-profile', 'profile-details']);
          });
        });
      })
    }
  }
}

export interface School {
  schoolImageUrl : string,
  name: string,
}
