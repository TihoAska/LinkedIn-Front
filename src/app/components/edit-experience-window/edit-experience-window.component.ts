import { Component } from '@angular/core';
import { HelperService } from '../../services/helper.service';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';
import { PageService } from '../../services/page.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-edit-experience-window',
  templateUrl: './edit-experience-window.component.html',
  styleUrl: './edit-experience-window.component.scss'
})
export class EditExperienceWindowComponent {
  years : any[] = [];
  showQuery = false;
  showCompaniesQuery = false;
  showCompanyImage = false;
  companyImage = '';

  monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  searchControl = new FormControl();
  searchCompaniesControl = new FormControl();

  companyLocations : any = [];
  filteredCompanyLocations : any = [];

  companies : any = [];
  filteredCompanies : Company[] = [];

  companyLocation = '';

  experienceForm = new FormGroup({
    title: new FormControl('', Validators.required),
    employmentType: new FormControl('', Validators.required),
    companyName: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    locationType: new FormControl('', Validators.required),
    startDateMonth: new FormControl('', Validators.required),
    startDateYear: new FormControl('Year', Validators.required),
    endDateMonth: new FormControl(''),
    endDateYear: new FormControl('Year'),
    description: new FormControl(''),
    profileHeadline: new FormControl(''),
    skills: new FormControl(''),
    media: new FormControl(''),
  });

  constructor(
    public helperService : HelperService,
    private profileService : ProfileService, 
    private userService : UserService, 
    private pageService : PageService) {
     
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

  ngOnInit(){
    this.profileService.$editExperienceFormValues.subscribe(ef => {

      this.pageService.getCompanyLocationByLocationId(this.profileService.$editExperienceFormValues?.value?.companyLocationId).subscribe(res => {
        this.companyLocation = res;

        this.showCompanyImage = true;
        this.companyImage = ef.companyImageUrl;

        let formattedDate = this.formatDate(ef);

        this.experienceForm = new FormGroup({
          title: new FormControl(ef.position, Validators.required),
          employmentType: new FormControl(ef.employmentType, Validators.required),
          companyName: new FormControl(ef?.company?.name, Validators.required),
          location: new FormControl(res.city + ', ' + res.county + ', ' + res.country, Validators.required),
          locationType: new FormControl(ef.locationType, Validators.required),
          startDateMonth: new FormControl(formattedDate.startMonth.toString(), Validators.required),
          startDateYear: new FormControl(formattedDate.startYear.toString(), Validators.required),
          endDateMonth: new FormControl(formattedDate.endMonth.toString()),
          endDateYear: new FormControl(formattedDate.endYear.toString()),
          description: new FormControl(''),
          profileHeadline: new FormControl(''),
          skills: new FormControl(''),
          media: new FormControl(''),
        });
      });
    });

    this.years.push('Year');
    for (let index = 2024; index > 1923; index--) {
      this.years.push(index);
    }

    this.pageService.getAllCompanyLocations().subscribe(res => {
      this.companyLocations = res;
    })

    this.pageService.getAllCompanies().subscribe(res => {
      this.companies = res;
    });
  }

  onInputChange(event : any){
    const inputValue = (event.target as HTMLInputElement).value;
    this.filteredCompanies = this.companies.filter((location : any) =>
      location.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    if(inputValue == ""){
      this.showCompanyImage = false;
      this.showCompaniesQuery = false;
    } else {
      this.filteredCompanies.forEach(company => {
        if(company.name != inputValue){
          this.companyImage = '../../../assets/images/pageLogos/default-experience.png';
        }
      });
  
      this.showCompaniesQuery = true;
      if (!inputValue.trim()) {
        this.filteredCompanies = [];
      } else {
        this.filteredCompanies = this.companies.filter((location : any) =>
          location.name.toLowerCase().includes(inputValue.toLowerCase())
        );
      }
    }
  }

  filterCompanyLocations(event : any) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.filteredCompanyLocations = this.companyLocations.filter((location : any) =>
      location.city.toLowerCase().includes(inputValue.toLowerCase())
    );

    this.showQuery = true;
    if (!inputValue.trim()) {
      this.filteredCompanyLocations = [];
    } else {
      this.filteredCompanyLocations = this.companyLocations.filter((location : any) =>
        location.city.toLowerCase().includes(inputValue.toLowerCase())
      );
    }
  }

  select(list : string, item : any){
    if(list == 'company')
    {
      this.showCompanyImage = true;
      this.showCompaniesQuery = false;
      const companyNameInput = document.querySelector<HTMLInputElement>('#company-name-input');

      if(companyNameInput){
        companyNameInput.value = item.name;
        this.experienceForm.get('companyName')?.setValue(item.name);

        this.companyImage = item.imageUrl;
      }
    } else if(list == 'companyLocation'){
      this.showQuery = false;
      const locationInput = document.querySelector<HTMLInputElement>('#location-input');

      if(locationInput){
        locationInput.value = item.city + ', ' + item.county + ', ' + item.country;
        this.experienceForm.get('location')?.setValue(item.city + ', ' + item.county + ', ' + item.country);
      }
    }
  }

  submitForm(){
    if(this.experienceForm.valid){
      let formattedLocation = this.experienceForm.value.location?.split(", ");

      if(formattedLocation != undefined){
        this.profileService.editExperience({
          id: this.profileService.$editExperienceFormValues.value.id,
          position: this.experienceForm.value.title,
          employmentType: this.experienceForm.value.employmentType,
          companyName: this.experienceForm.value.companyName,
          location: {
            city: formattedLocation[0],
            county: formattedLocation[1],
            country: formattedLocation[2]
          },
          locationType: this.experienceForm.value.locationType,
          startDate: this.experienceForm.value.startDateYear + '-' + this.experienceForm.value.startDateMonth + '-1T00:00:00.000Z',
          endDate: this.experienceForm.value.endDateYear + '-' + this.experienceForm.value.endDateMonth + '-1T00:00:00.000Z',
        }).subscribe(res => {
          console.log(res);
          this.experienceForm.reset();
          this.helperService.$showEditExperienceWindow.next(false);
          this.helperService.$dimBackground.next(false);
          this.profileService.getAllExperiencesForUser(this.userService.$loggedUser.value.id).subscribe(exp => {
            this.userService.$loggedUser.value.experience = exp;
          });
        });
      }
    }
  }

  closeWindow(){
    this.helperService.$dimBackground.next(false);
    this.helperService.$showEditExperienceWindow.next(false);
    this.showCompaniesQuery = false;
    this.showQuery = false;
    this.experienceForm.reset();
  }
}

export interface Company {
  imageUrl : string,
  name: string,
}