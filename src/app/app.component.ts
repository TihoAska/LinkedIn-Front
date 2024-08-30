import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { PageService } from './services/page.service';
import { HelperService } from './services/helper.service';

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
    private pageService : PageService,
    public helperService : HelperService
  ) {
    
    
  }

  ngOnInit(){
    if(typeof window !== 'undefined'){
      if(localStorage && localStorage.getItem('accessToken')){
        var user = this.userService.decodeUserFromToken(localStorage.getItem('accessToken'));
        this.userService.getUserByIdWithUserDetails(user.id).subscribe(res => {
          console.log(res?.education[0]?.startTime);
          console.log(res?.education[0]?.endTime);

          this.userService.$loggedUser.next(res);

          this.router.navigate(['your-profile', 'profile-details']);
        });
      } else{
        this.router.navigate(['sign-up']);
      }
    }
  }
}
