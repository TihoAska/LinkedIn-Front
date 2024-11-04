import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  showEmailAndPasswordForm = true;
  showFirstAndLastNameForm = false;
  showLocationForm = false;
  showJobForm = false;

  showToastMessage = false;

  emailAndPasswordFrom = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  firstAndLastNameForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
  });

  locationForm = new FormGroup({
    location: new FormControl('', Validators.required),
    postalCode: new FormControl('', Validators.required),
    locationWithinThisArea: new FormControl('', Validators.required),
  });

  jobForm = new FormGroup({
    jobTitle: new FormControl('', Validators.required),
    employmentType: new FormControl('', Validators.required),
    company: new FormControl('', Validators.required)
  });

  constructor(
    private userService : UserService,
    private router : Router) {
    
    
  }

  submitEmailAndPassword(formValue : any){
    if(this.emailAndPasswordFrom.valid){
      this.userService.getUserByEmail(this.emailAndPasswordFrom.value.email).subscribe(res => {
        if(res){
          this.showToastMessage = true;
        } else{
          this.showToastMessage = false;
          this.showEmailAndPasswordForm = false;
          this.showFirstAndLastNameForm = true;
        }
      });
    }
  }

  submitFirstAndLastName(formValue : any){
    if(this.firstAndLastNameForm.valid){
      this.showFirstAndLastNameForm = false;
      this.showLocationForm = true;
    }
  }

  submitLocation(formValue : any){
    if(this.locationForm.valid){
      this.showLocationForm = false;
      this.showJobForm = true;
    }
  }

  submitJobForm(formValue : any){
    if(this.jobForm.valid){
      this.showJobForm = false;
      this.createUser({
        firstName: this.firstAndLastNameForm.value.firstName,
        lastName: this.firstAndLastNameForm.value.lastName,
        email: this.emailAndPasswordFrom.value.email,
        password: this.emailAndPasswordFrom.value.password,
        job: this.jobForm.value.jobTitle,
      });
    }
  }

  createUser(userToCreate : any){
    this.userService.createUser(userToCreate).subscribe(res => {
      if(res && res.isAuthSuccessful){
        var userFromToken = this.userService.decodeUserFromToken((<any>res).accessToken);
        localStorage.setItem('accessToken', (<any>res).accessToken);
        localStorage.setItem('refreshToken', (<any>res).refreshToken);
        this.userService.getUserById(userFromToken.id).subscribe(res => {
          res.profileDetails.bannerImage = environment.baseUrl + res.profileDetails.bannerImage;
          this.userService.$loggedUser.next(res);
        });

        this.router.navigate(['your-profile', 'profile-details']);
      } 
      else{
        this.router.navigate(['sign-in']);
      }
    });
  }

  closeEmailAlreadyUsedToast(){
    this.showToastMessage = false;
  }
}
