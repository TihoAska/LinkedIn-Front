import { Component } from '@angular/core';
import { HelperService } from '../../services/helper.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';
import { PageService } from '../../services/page.service';

@Component({
  selector: 'app-add-licenses-window',
  templateUrl: './add-licenses-window.component.html',
  styleUrl: './add-licenses-window.component.scss'
})
export class AddLicensesWindowComponent {

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

  constructor(
    public helperService : HelperService, 
    public profileService : ProfileService, 
    public userService : UserService, 
    public pageService : PageService) {    
    
  }

  ngOnInit(){
    this.years.push('Year');
    for (let index = 2024; index > 1923; index--) {
      this.years.push(index);
    }

    this.profileService.$editLicenseFormValues.subscribe(lf => {
      this.pageService.getCompanyByName(lf.issuingOrganization).subscribe(res => {
        this.issuingOrganizationImage = res.imageUrl;
        this.showIssuingOrganizationImage = true;
      });
    });

    this.pageService.getAllCompanies().subscribe(res => {
      this.institutions = res;
    })
  }

  closeWindow(){
    this.helperService.$dimBackground.next(false);
    this.helperService.$showAddLicenseWindow.next(false);
  }

  onInputChange(event : any){
    const inputValue = (event.target as HTMLInputElement).value;

    this.filteredInstitutions = this.institutions.filter((institution : any) =>
      institution.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    if(inputValue == ""){
      this.showIssuingOrganizationImage = false;
    } 
    else 
    {
      this.filteredInstitutions.forEach(institution => {
        if(institution.name != inputValue){
          this.issuingOrganizationImage = '../../../assets/images/pageLogos/default-experience.png';
        }
      });

      this.showIssuingOrganizationImage = true;
      this.showIssuingOrganizationQuery = true;
    }
  }

  select(institution : any){
    this.showIssuingOrganizationQuery = false;
    
    this.licenseForm.patchValue({
      issuingOrganization: institution.name,
    });

    this.issuingOrganizationImage = institution.imageUrl;
  }

  submitForm(){
    if(this.licenseForm.valid){
      this.profileService.createLicenseForUser({
        userId: this.userService.$loggedUser.value.id,
        name: this.licenseForm.value.name,
        issuingOrganization: this.licenseForm.value.issuingOrganization,
        issueDate: this.licenseForm.value.issueDateYear + '-' + this.licenseForm.value.issueDateMonth + '-1T00:00:00.000Z',
        credentialId: this.licenseForm.value.credentialId,
      }).subscribe(res => {
        this.helperService.$dimBackground.next(false);
        this.helperService.$showAddLicenseWindow.next(false);
        this.profileService.getAllLicensesAndCertificationsForUser(this.userService.$loggedUser.value.id).subscribe(licenses => {
          this.userService.$loggedUser.value.licensesAndCertifications = licenses;
        });
      });
    }
  }
}

export interface Institution {
  name : string,
  imageUrl : string,
}
