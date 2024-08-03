import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'LinkedIn';

  constructor(
    private router : Router,
    private userService : UserService,
  ) {
    
    
  }

  ngOnInit(){
    if(typeof window !== 'undefined'){
      if(localStorage && localStorage.getItem('accessToken')){
        var user = this.userService.decodeUserFromToken(localStorage.getItem('accessToken'));
        this.userService.$loggedUser.next(user);
        this.router.navigate(['your-profile'])
      } else{
        this.router.navigate(['sign-up']);
      }
    }
  }
}
