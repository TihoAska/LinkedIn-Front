import { Component } from '@angular/core';
import { HelperService } from '../../services/helper.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { PageService } from '../../services/page.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-license-window',
  templateUrl: './edit-license-window.component.html',
  styleUrl: './edit-license-window.component.scss'
})
export class EditLicenseWindowComponent {

  institutions : any = [];
  filteredInstitutions : Institution[] = [];

  years : any[] = [];

  showIssuingOrganizationImage = false;
  showIssuingOrganizationQuery = false;
  issuingOrganizationImage = '';

  licenseForm = new FormGroup({
    name: new FormControl('', Validators.required),
    issuingOrganization: new FormControl('', Validators.required),
    issueDateMonth: new FormControl('', Validators.required),
    issueDateYear: new FormControl('Year', Validators.required),
    expirationDateMonth: new FormControl('', Validators.required),
    expirationDateYear: new FormControl('Year', Validators.required),
    credentialId: new FormControl('', Validators.required),
    credentialUrl: new FormControl('https://www.youtube.com/watch?v=xYavnl1nPho', Validators.required),
  })
  
  constructor(public helperService : HelperService, public profileService : ProfileService, public pageService : PageService, public userService : UserService) {  
    
  }

  ngOnInit(){
    this.years.push('Year');
    for (let index = 2024; index > 1923; index--) {
      this.years.push(index);
    }

    this.profileService.$editLicenseFormValues.subscribe(lf => {
      let formattedDate = this.formatDate(lf.issueDate);

      this.licenseForm.patchValue({
        name: lf.name,
        issuingOrganization: lf.issuingOrganization,
        issueDateMonth: formattedDate.startMonth,
        issueDateYear: formattedDate.startYear,
        credentialId: lf.credentialId,
      });

      this.pageService.getCompanyByName(lf.issuingOrganization).subscribe(res => {
        this.issuingOrganizationImage = res?.imageUrl;
        this.profileService.$showIssuingOrganizationImage.next(true);
      });
    });

    this.pageService.getAllCompanies().subscribe(res => {
      this.institutions = res;
    })
  }

  formatDate(date : any){
    let newDate = new Date(date);

    let startMonth = (newDate.getMonth() + 1).toString();

    if(startMonth.length == 1){
      startMonth = "0" + startMonth; 
    }

    return {
      startMonth: startMonth,
      startYear: newDate.getFullYear().toString(),
    }
  }

  closeWindow(){
    this.helperService.$showEditLicenseWindow.next(false);
    this.helperService.$dimBackground.next(false);
    this.licenseForm.reset();
    this.profileService.$showIssuingOrganizationImage.next(false);
    this.showIssuingOrganizationQuery = false;
  }

  onInputChange(event : any){
    const inputValue = (event.target as HTMLInputElement).value;

    this.filteredInstitutions = this.institutions.filter((institution : any) =>
      institution.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    if(inputValue == ""){
      this.profileService.$showIssuingOrganizationImage.next(false);
    } 
    else 
    {
      this.filteredInstitutions.forEach(institution => {
        if(institution.name != inputValue){

          this.issuingOrganizationImage = '../../../assets/images/pageLogos/default-experience.png';
        }
      });

      this.profileService.$showIssuingOrganizationImage.next(true);
      this.showIssuingOrganizationQuery = true;
    }
  }

  select(institution : any){
    this.showIssuingOrganizationQuery = false;
    this.profileService.$showIssuingOrganizationImage.next(true);
    
    this.licenseForm.patchValue({
      issuingOrganization: institution.name,
    });

    this.issuingOrganizationImage = institution.imageUrl;
  }

  submitForm(){
    if(this.licenseForm.valid){
      this.profileService.editLicenseForUser({
        id: this.profileService.$editLicenseFormValues.value.id,
        name: this.licenseForm.value.name,
        issuingOrganization: this.licenseForm.value.issuingOrganization,
        issueDate: this.licenseForm.value.issueDateYear + '-' + this.licenseForm.value.issueDateMonth + '-1T00:00:00.000Z',
        credentialId: this.licenseForm.value.credentialId,
        credentialUrl: this.licenseForm.value.credentialUrl,
      }).subscribe(res => {
        this.helperService.$dimBackground.next(false);
        this.helperService.$showEditLicenseWindow.next(false);
        this.profileService.$showIssuingOrganizationImage.next(false);
        this.showIssuingOrganizationQuery = false;
        this.profileService.getAllLicensesAndCertificationsForUser(this.userService.$loggedUser.value.id).subscribe(response => {
          this.userService.$loggedUser.value.licensesAndCertifications = response;
        }, error => console.log(error));
      });
    }
  }

  deleteLicense(){
    this.profileService.deleteLicense({
      userId: this.userService.$loggedUser.value.id,
      licenseId: this.profileService.$editLicenseFormValues.value.id,
    }).subscribe(res => {
      if(res){
        this.helperService.$dimBackground.next(false);
        this.helperService.$showEditLicenseWindow.next(false);
        this.licenseForm.reset();
        this.profileService.$showIssuingOrganizationImage.next(false);
        this.profileService.getAllLicensesAndCertificationsForUser(this.userService.$loggedUser.value.id).subscribe(licenses => {
          this.userService.$loggedUser.next({
            ...this.userService.$loggedUser.value,
            licensesAndCertifications: licenses,
          });
        });
      }
    });
  }
}

export interface Institution {
  name : string,
  imageUrl : string,
}
