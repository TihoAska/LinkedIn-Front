import { FormGroup } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { PageService } from '../../services/page.service';
import { HelperService } from '../../services/helper.service';
import { Router } from '@angular/router';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  otherSimilarProfiles : any = [];
  peopleYouMayKnow : any = [];
  twoPages : any = [];
  buttonStates: { [key: number]: boolean } = {};
  buttonConnectText : string = 'Connect';
  buttonSentText: string = 'Sent...';

  constructor(
    public pageService : PageService,
    public userService : UserService,
    public helperService : HelperService,
    private router : Router,
    public messagesService : MessagesService) {

  }

  ngOnInit(){
    this.userService.$loggedUser.subscribe(user => {
      if(user.id){
        this.userService.getFiveOtherSimilarProfiles().subscribe(res => {
          this.otherSimilarProfiles = [];
          this.userService.$otherSimilarProfiles.next(res);
          if(res && res.length){
            this.otherSimilarProfiles.push(res);
          }
        });
        this.userService.getFivePeopleYouMayKnow().subscribe(res => {
          this.peopleYouMayKnow = [];
          this.userService.$peopleYouMayKnow.next(res);
          if(res && res.length){
            this.peopleYouMayKnow.push(res);
          }
        });
        this.pageService.getTwoPages().subscribe(res => {
          this.twoPages = [];
          if(res && res.length){
            this.pageService.$twoPages.next(res);
            this.twoPages.push(res);
          }
        });
      }
    });

    this.helperService.$dimBackground.subscribe(res => {
      if(res){
        document.querySelector('.container')?.classList.add('no-scroll');
      } else{
        document.querySelector('.container')?.classList.remove('no-scroll');
      }
    });
  } 

  dimBackground(){
    this.helperService.$dimBackground.next(true);
    this.helperService.$showAddExperienceWindow.next(true);
  }

  editExperiences(){
    this.router.navigate(['your-profile', 'edit-experience']);
  }

  followedPages : any[] =  [];

  followPage(page : any){
    this.pageService.followPage({
      userId: this.userService.$loggedUser.value.id,
      pageName: page.name,
    }).subscribe((res : any) => {
      if(res.succeeded){
        this.userService.$loggedUser.value.pagesFollowing.push(page);
      } else {
        this.pageService.unfollowPage(this.userService.$loggedUser.value.id, page.name).subscribe((response : any) => {
          if(response.succeeded){
            const index = this.userService.$loggedUser.value.pagesFollowing.findIndex((p : any) => p.name == page.name);
            this.userService.$loggedUser.value.pagesFollowing.splice(index, 1);
          }
        });
      }
    });
  }

  isFollowing(followedPage : any){
    return this.userService.$loggedUser.value.pagesFollowing.some((page : any) => page.name == followedPage.name);
  }

  getPageByName(pageName : string){
    this.pageService.getPageByName(pageName);
  }

  sendConnection(receiverId : number){
    this.userService.sendConnection(this.userService.$loggedUser.value.id, receiverId).subscribe(res => {
      this.buttonStates[receiverId] = true;
    });
  }

  getMonthDifference(startDate: Date, endDate: Date) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    let yearsDifference = end.getFullYear() - start.getFullYear();
    let monthsDifference = end.getMonth() - start.getMonth();
    
    if (monthsDifference < 0) {
      yearsDifference--;
      monthsDifference+=12;
    }
  
    let result = '';

    if (yearsDifference > 0) {
      result += `${yearsDifference} yr${yearsDifference > 1 ? 's' : ''}`;
    }
    if (monthsDifference > 0) {
      if (result) result += ' ';
      result += `${monthsDifference} mo${monthsDifference > 1 ? 's' : ''}`;
    }
  
    return result || '0 mos';
  }

  closeError(){
    this.helperService.$displayError.next(false);
  }

  openChatWindow(profile : any){
    this.messagesService.$chatWindowProfile.next(profile);
  }
}
