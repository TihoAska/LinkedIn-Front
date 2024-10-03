import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { PageService } from '../../services/page.service';
import { UserService } from '../../services/user.service';
import { HelperService } from '../../services/helper.service';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MessagesService } from '../../services/messages.service';
import { WebSocketService } from '../../services/web-socket.service';
import { BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  providers: [DatePipe],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        transform: 'translateY(0)',
      })),
      state('expanded', style({
        transform: 'translateY(-1200px)',
      })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
      ]),
    ]),
    trigger('expandCollapseContent', [
      state('collapsed', style({
        transform: 'translateY(1200px)',
      })),
      state('expanded', style({
        transform: 'translateY(0)',
      })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
      ]),
    ]),
    trigger('expandShrinkWindow', [
      state('shrinked', style({
        'height': '400px',
        'width': '350px',
      })),
      state('expanded', style({
        'height': '700px',
        'width': '500px',
      })),
      transition('shrinked <=> expanded', [
        animate('300ms ease-in-out')
      ]),
    ]),
    trigger('minimizeRestoreWindow', [
      state('minimized', style({
        transform: 'translateY({{translateY}}px)',
        width: '200px',
      }), { params: { translateY: 650 } }),
      state('restored', style({
        transform: 'translateY(0)',
        width: '{{width}}px',
      }), { params: { width: 500 } }),
      transition('minimized <=> restored', [
        animate('300ms ease-in-out')
      ]),
    ]),
  ],
})
export class MainComponent {
  icons = [
    {
      name: 'Home',
      shape: 'M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7z',
    },
    {
      name: 'My Network',
      shape: 'M12 16v6H3v-6a3 3 0 013-3h3a3 3 0 013 3zm5.5-3A3.5 3.5 0 1014 9.5a3.5 3.5 0 003.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5zM7.5 2A4.5 4.5 0 1012 6.5 4.49 4.49 0 007.5 2z',
    },
    {
      name: 'Jobs',
      shape: 'M17 6V5a3 3 0 00-3-3h-4a3 3 0 00-3 3v1H2v4a3 3 0 003 3h14a3 3 0 003-3V6zM9 5a1 1 0 011-1h4a1 1 0 011 1v1H9zm10 9a4 4 0 003-1.38V17a3 3 0 01-3 3H5a3 3 0 01-3-3v-4.38A4 4 0 005 14z',
    },
    {
      name: 'Messaging',
      shape: 'M16 4H8a7 7 0 000 14h4v4l8.16-5.39A6.78 6.78 0 0023 11a7 7 0 00-7-7zm-8 8.25A1.25 1.25 0 119.25 11 1.25 1.25 0 018 12.25zm4 0A1.25 1.25 0 1113.25 11 1.25 1.25 0 0112 12.25zm4 0A1.25 1.25 0 1117.25 11 1.25 1.25 0 0116 12.25z',
    },
    {
      name: 'Notifications',
      shape: 'M22 19h-8.28a2 2 0 11-3.44 0H2v-1a4.52 4.52 0 011.17-2.83l1-1.17h15.7l1 1.17A4.42 4.42 0 0122 18zM18.21 7.44A6.27 6.27 0 0012 2a6.27 6.27 0 00-6.21 5.44L5 13h14z',
    },
  ];

  @ViewChildren('chatContent') chatContents!: QueryList<ElementRef>;

  isExpanded = false;
  isShrinked = false;
  isChatWindowOpen = false;
  isChatWindowMinimized = false;

  chatMessages : string[] = [];
  chatWindows : any[] = [];
  receivedMessages : any[] = [];
  messagesInput: { [key: string]: string } = {};

  fetchedChatMessages : BehaviorSubject<any> = new BehaviorSubject<any>([]);
  $usersFromChat : BehaviorSubject<any> = new BehaviorSubject<any>([]);

  otherSimilarProfiles : any = [];
  peopleYouMayKnow : any = [];
  twoPages : any = [];
  buttonStates: { [key: number]: boolean } = {};
  buttonConnectText : string = 'Connect';
  buttonSentText: string = 'Sent...';

  loggedInUser : any;

  constructor(
    public pageService : PageService,
    public userService : UserService,
    public helperService : HelperService,
    public router : Router,
    public messagesService : MessagesService,
    public webSocketService : WebSocketService,
    private datePipe : DatePipe) {

  }

  ngOnInit(){
    this.userService.$loggedUser.subscribe(user => {
      if(user.id){
        this.loggedInUser = user;

        this.userService.getFiveOtherSimilarProfiles().subscribe(res => {
          this.otherSimilarProfiles = [];
          this.userService.$otherSimilarProfiles.next(res);
          this.otherSimilarProfiles.push(res);
        });
        this.userService.getFivePeopleYouMayKnow().subscribe(res => {
          this.peopleYouMayKnow = [];
          this.userService.$peopleYouMayKnow.next(res);
          this.peopleYouMayKnow.push(res);
        });
        this.pageService.getTwoPages().subscribe(res => {
          this.twoPages = [];
          this.pageService.$twoPages.next(res);
          this.twoPages.push(res);
        });

        this.messagesService.getAllMessagesForUser(this.userService.$loggedUser.value.id).subscribe(res => {
          this.fetchedChatMessages.next(res);
          const uniqueUserIds = new Set<number>();

          res.forEach((message: any) => {
            uniqueUserIds.add(message.senderId);
            uniqueUserIds.add(message.receiverId);
          });

          const uniqueUserIdsArray = Array.from(uniqueUserIds);
          this.fetchUsersFromIds(uniqueUserIdsArray);
        });

        this.webSocketService.newMessage.subscribe(res => {
          if (res) {
            let chatWindowIndex = this.chatWindows.findIndex(cw => cw.profile.id == res.SenderId);
            this.fetchedChatMessages.value.push({
              content: res.Content,
              id: res.Id, 
              receiverId: res.ReceiverId,
              senderId: res.SenderId,
              timeSent: res.TimeSent,
            });

            this.sortChatMessagesByTimeOFLastMessage(res.SenderId);

            if (chatWindowIndex !== -1) {
              this.chatWindows[chatWindowIndex].messages = this.chatWindows[chatWindowIndex].messages || [];
              this.chatWindows[chatWindowIndex].messages.push({
                content: res.Content,
                id: res.Id, 
                receiverId: res.ReceiverId,
                senderId: res.SenderId,
                timeSent: res.TimeSent,
              });

              this.scrollToBottom(chatWindowIndex);
            }
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

    this.userService.$receivedConnection.subscribe(res => {
      if(res && res != ''){
        this.helperService.showRedDots[1] = true;
      } else {
        this.helperService.showRedDots[1] = false;
      }
    });
  } 

  sortChatMessagesByTimeOFLastMessage(senderId : number){
    this.$usersFromChat.value.forEach((user: any) => {
      if (user.chat.id == senderId) {
        user.timeOfLastMessage = new Date();
    
        let sortedUsers = [...this.$usersFromChat.value].sort((a: any, b: any) => {
          return new Date(b.timeOfLastMessage).getTime() - new Date(a.timeOfLastMessage).getTime();
        });
    
        this.$usersFromChat.next(sortedUsers);
      }
    });
  }

  fetchUsersFromIds(userIds: number[]) {
    let chats = this.userService.$loggedUser.value.connections.filter((connection : any) => 
      userIds.some(userId => 
        userId == connection.id && 
        userId != this.userService.$loggedUser.value.id
      )
    );

    let chatsWithLastMessageSentTime : any = [];

    chats.forEach((chat : any) => {
      chatsWithLastMessageSentTime.push({
        chat: chat,
        timeOfLastMessage: this.getLastMessageFullTimeSent(chat),
      });
    });

    chatsWithLastMessageSentTime.sort((a: any, b: any) => {
      return new Date(b.timeOfLastMessage).getTime() - new Date(a.timeOfLastMessage).getTime();
    });

    this.$usersFromChat.next(chatsWithLastMessageSentTime);
  }

  getLastMessageFullTimeSent(profile : any){
    let messagesForUser = this.fetchedChatMessages.value.filter((cm : any) => cm.senderId == profile.id || cm.receiverId == profile.id);

    if(messagesForUser){
      return messagesForUser[messagesForUser.length-1]?.timeSent;
    }

    return null;
  }

  dimBackground(){
    this.helperService.$dimBackground.next(true);
    this.helperService.$showEditExperienceWindow.next(true);
  }

  editExperiences(){
    this.helperService.$showEditExperienceWindow.next(true);
    this.helperService.$showProfile.next(false);
  }

  followPage(pageName : string){
    this.pageService.followPage(pageName);
  }

  getPageByName(pageName : string){
    this.pageService.getPageByName(pageName);
  }

  getOtherSimilarProfiles(){
    this.userService.getFiveOtherSimilarProfiles().subscribe(res => {
      this.otherSimilarProfiles = [];
      this.userService.$otherSimilarProfiles.next(res);
      this.otherSimilarProfiles.push(res[0]);
    });
  }

  getPeopleYouMayKnow(){
    this.userService.getFivePeopleYouMayKnow().subscribe(res => {
      this.peopleYouMayKnow = [];
      this.userService.$peopleYouMayKnow.next(res);
      this.peopleYouMayKnow.push(res[0]);
    });
  }

  sendConnection(receiverId : number){
    this.userService.sendConnection(this.userService.$loggedUser.value.id, receiverId).subscribe(res => {
      this.buttonStates[receiverId] = true;
      console.log(res);
    });
  }

  navigateTo(route : any){
    if(route.name == "My Network"){
      this.router.navigate(['', 'my-network']);
    } else if(route == "Profile"){
      this.router.navigate(['', 'your-profile', 'profile-details']);
    }
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

  toggleChatBox() { //veliki prozor sa svim chatovima
    this.isExpanded = !this.isExpanded;
  }

  toggleWindowShrink(){ //povecaj/smanji chat prozor
    this.isShrinked = !this.isShrinked;
  }

  closeChatWindow(chatWindow : any){
    const index = this.chatWindows.findIndex((cw : any) => cw.profile.id == chatWindow.profile.id);
    this.chatWindows.splice(index, 1);
  }

  openChatWindow(profile : any){
    let windowAlreadyOpen = this.chatWindows.some(window => window.profile.id === profile.id);
    if (windowAlreadyOpen) {
      return;
    }

    if(this.chatWindows.length >= 4){
      this.chatWindows.pop();
    }

    this.chatWindows.push({
      profile: profile,
      messages: this.fetchedChatMessages.value.filter((cm : any) => cm.senderId == profile.id || cm.receiverId == profile.id),
      minimized: false,
    });

    setTimeout(() => {
      const index = this.chatWindows.findIndex(cw => cw.profile.id === profile.id);
      this.scrollToBottom(index);
    }, 0); 
  }

  getLastMessage(profile : any){
    let messagesForUser = this.fetchedChatMessages.value.filter((cm : any) => cm.senderId == profile.id || cm.receiverId == profile.id);

    if(messagesForUser[messagesForUser.length-1]?.senderId == profile.id){
      return (profile.firstName + ': ' + messagesForUser[messagesForUser.length-1]?.content);
    } else{
      return ('You: ' + messagesForUser[messagesForUser.length-1]?.content);
    }
  }

  getLastMessageTimeSent(profile : any){
    let messagesForUser = this.fetchedChatMessages.value.filter((cm : any) => cm.senderId == profile.id || cm.receiverId == profile.id);

    if(messagesForUser){
      let lastMessageTime = messagesForUser[messagesForUser.length-1]?.timeSent;

      return this.datePipe.transform(lastMessageTime, 'MMM dd');
    }

    return null;
  }

  toggleMinimizeRestoreWindow(chatWindow : any){
    chatWindow.minimized = !chatWindow.minimized;
  }

  isNewDay(currentTime: string, previousTime: string): boolean {
    const currentDate = new Date(currentTime).setHours(0, 0, 0, 0);
    const previousDate = new Date(previousTime).setHours(0, 0, 0, 0);
  
    return currentDate !== previousDate;
  }

  getAnimationParams() {
    return {
      translateY: this.isShrinked ? 350 : 650,
      width: this.isShrinked ? 350 : 500,
    };
  }

  sendMessage(event : any, chatWindow : any){
    if(this.messagesInput[chatWindow.profile.id]?.trim()){
      event.preventDefault();

      const sanitizedMessage = this.messagesInput[chatWindow.profile.id].replace(/\n/g, '').trim();
      
      this.messagesService.sendMessage({
        receiverId: chatWindow.profile.id,
        senderId: this.userService.$loggedUser.value.id, 
        content: sanitizedMessage,
      }).subscribe(res => {
        let index = this.chatWindows.findIndex(cw => cw.profile.id === chatWindow.profile.id);
        if (index !== -1) {
          this.fetchedChatMessages.value.push(res);
          this.chatWindows[index].messages = this.chatWindows[index].messages || [];
          this.chatWindows[index].messages.push(res);
          this.messagesInput[chatWindow.profile.id] = '';
        }
        
        this.sortChatMessagesByTimeOFLastMessage(chatWindow.profile.id);

        this.scrollToBottom(index);
      });
    }
  }

  changeMessageReceiver(messageReceiver : any){
    this.messagesService.messageReceiver.next(messageReceiver);
  }

  scrollToBottom(chatWindowIndex: number){
    const chatContent = this.chatContents.toArray()[chatWindowIndex]?.nativeElement;
    if (chatContent) {
      setTimeout(() => {
        chatContent.scrollTop = chatContent.scrollHeight;
      }, 0);
    }
  }
}
