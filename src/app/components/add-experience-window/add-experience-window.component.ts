import { Component } from '@angular/core';
import { HelperService } from '../../services/helper.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';
import { PageService } from '../../services/page.service';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-add-experience-window',
  templateUrl: './add-experience-window.component.html',
  styleUrl: './add-experience-window.component.scss'
})
export class AddExperienceWindowComponent {
  years : any[] = [];
  showQuery = false;
  showCompaniesQuery = false;
  showCompanyImage = false;
  companyImage = '../../../assets/images/pageLogos/default-experience.png';

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

  searchControl = new FormControl();
  searchCompaniesControl = new FormControl();

  companyLocations : any = [];
  filteredCompanyLocations : any = [];

  companies : any = [];
  filteredCompanies : Company[] = [];

  constructor(public helperService : HelperService, private profileService : ProfileService, private userService : UserService, private pageService : PageService) {
     
  }

  ngOnInit(){
    this.years.push('Year');
    for (let index = 2024; index > 1923; index--) {
      this.years.push(index);
    }

    this.pageService.getAllCompanyLocations().subscribe(res => {
      this.companyLocations = res;
    })

    this.searchControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((query) => {
        this.filterCompanyLocations(query);
    });

    this.pageService.getAllCompanies().subscribe(res => {
      this.companies = res;
    });

    this.searchCompaniesControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((query) => {
        this.filterCompanies(query);
    });
  }

  onInputChange(event : any){
    const inputValue = (event.target as HTMLInputElement).value;

    if(inputValue == ""){
      this.showCompanyImage = false;
    } else {
      this.showCompanyImage = true;
    }
  }

  filterCompanyLocations(query: string) {
    this.showQuery = true;
    if (!query.trim()) {
      this.filteredCompanyLocations = [];
    } else {
      this.filteredCompanyLocations = this.companyLocations.filter((location : any) =>
        location.city.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  filterCompanies(query : string){
    this.filteredCompanies.forEach(company => {
      if(company.name != query){
        this.companyImage = '../../../assets/images/pageLogos/default-experience.png';
      }
    });

    this.showCompaniesQuery = true;
    if (!query.trim()) {
      this.filteredCompanies = [];
    } else {
      this.filteredCompanies = this.companies.filter((location : any) =>
        location.name.toLowerCase().includes(query.toLowerCase())
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
        this.profileService.createExperience({
          userId: this.userService.$loggedUser.value.id,
          position: this.experienceForm.value.title,
          companyName: this.experienceForm.value.companyName,
          employmentType: this.experienceForm.value.employmentType,
          startTime: this.experienceForm.value.startDateYear + '-' + this.experienceForm.value.startDateMonth + '-1T00:00:00.000Z',
          endTime: this.experienceForm.value.endDateYear + '-' + this.experienceForm.value.endDateMonth + '-1T00:00:00.000Z',
          location: {
            city: formattedLocation[0],
            county: formattedLocation[1],
            country: formattedLocation[2]
          },
          locationType: this.experienceForm.value.locationType,
        }).subscribe(res => {
          this.showCompanyImage = false;
          this.helperService.$showAddExperienceWindow.next(false);
          this.helperService.$dimBackground.next(false);
          this.resetForm();
          this.profileService.getAllExperiencesForUser(this.userService.$loggedUser.value.id).subscribe(exp => {
            this.userService.$loggedUser.next({
              ...this.userService.$loggedUser.value,
              experience: exp,
            });
          });
        });
      }
    }
  }

  resetForm(){
    this.experienceForm.reset({
      employmentType: '',
      startDateMonth: '',
      startDateYear: 'Year',
      endDateMonth: '',
      endDateYear: 'Year',
      companyName: '',
      location: '',
    });
  }

  closeWindow(){
    this.helperService.$dimBackground.next(false);
    this.helperService.$showAddExperienceWindow.next(false);
    this.resetForm();
    this.showCompanyImage = false;
  }
}

export interface Company {
  imageUrl : string,
  name: string,
}
