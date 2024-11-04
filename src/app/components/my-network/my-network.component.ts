import { Component } from '@angular/core';
import { User, UserService } from '../../services/user.service';
import { HelperService } from '../../services/helper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-network',
  templateUrl: './my-network.component.html',
  styleUrl: './my-network.component.scss'
})
export class MyNetworkComponent {

  profiles : any[] = [];
  displayedProfiles : any[] = [];
  displayDisplayedProfiles = false;

  receivedConnections : any[] = [];
  sentConnections : any[] = [];

  hasReceivedConnections = false;

  selectedReceivedOrSent = 'received';
  userConnections : any = [];

  constructor(public userService : UserService, public helperService : HelperService, public router : Router) {

  }

  ngOnInit(){
    this.helperService.showRedDots[1] = false;

    this.userService.$loggedUser.subscribe(res => {
      if(res.id){
        this.userService.getAllUserConnections(res.id).subscribe(userConnections => {
          userConnections.forEach((userConnection : any) => {
            if(userConnection.senderId != res.id){
              this.userConnections.push(userConnection.sender);
            } else if(userConnection.receiverId != res.id){
              this.userConnections.push(userConnection.receiver);
            }
          });
      
          this.displayedProfiles = this.profiles.filter(profile => {
            const isLoggedInUser = profile.id === this.userService.$loggedUser.value.id;
            
            const isAlreadyConnected = userConnections.some((userConnection: any) => {
              return (userConnection.senderId === profile.id || userConnection.receiverId === profile.id);
            });
        
            return !isLoggedInUser && !isAlreadyConnected && 
              profile.education.some((education: any) => education.name === this.userService.$loggedUser.value.education[0].name);
          })
          .slice(0, 8);
    
          if(this.displayedProfiles.length > 0){
            this.displayDisplayedProfiles = true;
          }
        });
      }
    });

    if(this.userService.$loggedUser.value.id){
      this.userService.getPendingConnectionsForUser(this.userService.$loggedUser.value.id).subscribe(res => {
        if(res && res.length){
          this.hasReceivedConnections = true;
          this.receivedConnections = res.filter((connection : any) => connection.receiverId == this.userService.$loggedUser.value.id);
          this.sentConnections = res.filter((connection : any) => connection.senderId == this.userService.$loggedUser.value.id);
    
          if(this.receivedConnections.length > 0){
            this.selectedReceivedOrSent = 'received';
          } else if(this.sentConnections.length > 0) {
            this.selectedReceivedOrSent = 'sent';
          } else {
            this.hasReceivedConnections = false;
          }
        }
      });
    }
  }

  acceptConnection(connectionId : number){
    this.userService.acceptConnection(connectionId).subscribe(res => {
      const index = this.receivedConnections.findIndex(connection => connection.id == res.id);
      this.receivedConnections.splice(index, 1);

      if(this.receivedConnections.length <= 0 && this.sentConnections.length > 0){
        this.selectedReceivedOrSent = 'sent';
      } else if(this.sentConnections.length <= 0 && this.receivedConnections.length <= 0) {
        this.hasReceivedConnections = false;
      }
    });
  }

  rejectConnection(connectionId : number){
    this.userService.rejectConnection(connectionId).subscribe(res => {
      const index = this.receivedConnections.findIndex(connection => connection.id == res.id);
      this.receivedConnections.splice(index, 1);

      if(this.receivedConnections.length <= 0 && this.sentConnections.length > 0){
        this.selectedReceivedOrSent = 'sent';
      } else if(this.sentConnections.length <= 0 && this.receivedConnections.length <= 0) {
        this.hasReceivedConnections = false;
      }
    });
  }

  withdrawConnection(profile : any){
    this.userService.withdrawConnection(profile.receiverId).subscribe(res => {
      const index = this.sentConnections.findIndex(connection => connection.id == res.id);
      this.sentConnections.splice(index, 1);
      this.displayedProfiles.push(new User(res.receiver.id, res.receiver.firstName, res.receiver.lastName, res.receiver.email, res.receiver.job, res.receiver.education, res.receiver.imageUrl, res.receiver.profileDetails.bannerImage));

      if(this.sentConnections.length <= 0 && this.receivedConnections.length > 0){
        this.selectedReceivedOrSent = 'received';
      } else if(this.sentConnections.length <= 0 && this.receivedConnections.length <= 0) {
        this.hasReceivedConnections = false;
      }
    });
  }

  toggleSentReceived(tab : string){
    if(tab == 'sent'){
      this.selectedReceivedOrSent = 'sent';
    } else if (tab == 'received'){
      this.selectedReceivedOrSent = 'received';
    }
  }

  sendConnection(profile : any){
    this.userService.sendConnection(this.userService.$loggedUser.value.id, profile.id).subscribe(res => {
      this.sentConnections.push(res);
      const index = this.displayedProfiles.findIndex(dp => dp.id == profile.id);
      this.displayedProfiles.splice(index, 1);
      this.hasReceivedConnections = true;
    });
  }

  hideProfile(profile : any){
    const index = this.displayedProfiles.findIndex(dp => dp.id == profile.id);
    this.displayedProfiles.splice(index, 1);

    if(this.displayedProfiles.length <= 0){
      this.displayDisplayedProfiles = false;
    }
  }
}
