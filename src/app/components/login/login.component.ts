import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  displayEmailError = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(
    private userService: UserService,
    private router: Router) {
    
  }

  signIn(loginFormValues : any){
    this.displayEmailError = false;

    if(this.loginForm.valid){
      this.userService.login({
        email: loginFormValues.value.email,
        password: loginFormValues.value.password
      }).subscribe(res => {
        if(res && res.isAuthSuccessful){
          var userFromToken = this.userService.decodeUserFromToken(res.accessToken);

          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);
  
          var user = this.userService.getUserById(userFromToken.id);
          this.userService.$loggedUser.next(user);

          this.router.navigate(['your-profile']);
        } else{
          this.displayEmailError = true;
        }
      });
    }
  }
}
