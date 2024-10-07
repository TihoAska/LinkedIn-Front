import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../../services/user.service';
import { MessagesService } from '../../services/messages.service';
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrl: './messaging.component.scss'
})
export class MessagingComponent {

  messageInput : any = '';
  chatWindow : any = {};
  $usersFromChat : BehaviorSubject<any> = new BehaviorSubject<any>([]);
  $fetchedChatMessages : BehaviorSubject<any> = new BehaviorSubject<any>([]);
  @ViewChild('chatContent') chatContent!: ElementRef;
  loggedInUser : any = {}
  chatsWithLastMessageSentTime : any = [];
  tabs = [
    {
      name: 'Index',
      isSelected: true,
    }, 
    {
      name: 'Unread',
      isSelected: false,
    },  
    {
      name: 'MyConnections',
      isSelected: false,
    },  
    {
      name: 'InMail',
      isSelected: false,
    }, 
    {
      name: 'Starred',
      isSelected: false,
    }, 
  ]

  constructor(
    public userService : UserService, 
    public messagesService : MessagesService, 
    public webSocketService : WebSocketService) {
        
  }

  ngOnInit(){
    this.userService.$loggedUser.subscribe(res => {
      this.loggedInUser = res;
    });
    this.messagesService.getAllMessagesForUser(this.userService.$loggedUser.value.id).subscribe(res => {
      this.$fetchedChatMessages.next(res);
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
        this.$fetchedChatMessages.value.push({
          content: res.Content,
          id: res.Id, 
          receiverId: res.ReceiverId,
          senderId: res.SenderId,
          timeSent: res.TimeSent,
        });

        this.chatWindow.messages.push({
          content: res.Content,
          id: res.Id, 
          receiverId: res.ReceiverId,
          senderId: res.SenderId,
          timeSent: res.TimeSent,
        });

        this.scrollToBottom();
        this.sortChatMessagesByTimeOFLastMessage(res.SenderId);
      }
    });
  }

  sendMessage(event : any, chatWindow : any){
    console.log(chatWindow.length);

    if(this.messageInput.trim()){
      event.preventDefault();

      const sanitizedMessage = this.messageInput.replace(/\n/g, '').trim();
      
      this.messagesService.sendMessage({
        receiverId: chatWindow.profile.chat.id,
        senderId: this.userService.$loggedUser.value.id, 
        content: sanitizedMessage,
      }).subscribe(res => {
        this.$fetchedChatMessages.value.push(res);
        this.chatWindow.messages = this.chatWindow.messages || [];
        this.chatWindow.messages.push(res);
        this.messageInput = '';
        
        this.sortChatMessagesByTimeOFLastMessage(chatWindow.profile.chat.id);
        this.scrollToBottom();
      });
    }
  }

  isTextareaEmpty(){
    if(this.messageInput.trim()){
      return false;
    }

    return true;
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

    this.chatsWithLastMessageSentTime = [];

    chats.forEach((chat : any) => {
      this.chatsWithLastMessageSentTime.push({
        chat: chat,
        timeOfLastMessage: this.getLastMessageFullTimeSent(chat),
        isSelected: false,
      });
    });

    this.chatsWithLastMessageSentTime.sort((a: any, b: any) => {
      return new Date(b.timeOfLastMessage).getTime() - new Date(a.timeOfLastMessage).getTime();
    });

    this.$usersFromChat.next(this.chatsWithLastMessageSentTime);
  }

  getLastMessageFullTimeSent(profile : any){
    let messagesForUser = this.$fetchedChatMessages.value.filter((cm : any) => cm.senderId == profile.id || cm.receiverId == profile.id);

    if(messagesForUser){
      return messagesForUser[messagesForUser.length-1]?.timeSent;
    }

    return null;
  }

  getLastMessage(profile : any){
    let messagesForUser = this.$fetchedChatMessages.value.filter((cm : any) => cm.senderId == profile.chat.id || cm.receiverId == profile.chat.id);

    if(messagesForUser[messagesForUser.length-1]?.senderId == profile.chat.id){
      return (profile.chat.firstName + ': ' + messagesForUser[messagesForUser.length-1]?.content);
    } else{
      return ('You: ' + messagesForUser[messagesForUser.length-1]?.content);
    }
  }

  openChatWindow(profile : any){
    this.chatsWithLastMessageSentTime.forEach((chat : any) => {
      chat.isSelected = false;
    });

    profile.isSelected = true;

    this.chatWindow = {
      profile: profile,
      messages: this.$fetchedChatMessages.value.filter((cm : any) => cm.senderId == profile.chat.id || cm.receiverId == profile.chat.id),
    };

    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.chatContent) {
      setTimeout(() => {
        const element = this.chatContent.nativeElement;
        element.scrollTop = element.scrollHeight;
      }, 0);
    }
  }

  isNewDay(currentTime: string, previousTime: string): boolean {
    const currentDate = new Date(currentTime).setHours(0, 0, 0, 0);
    const previousDate = new Date(previousTime).setHours(0, 0, 0, 0);
  
    return currentDate !== previousDate;
  }

  isChatWindowEmpty(): boolean {
    let result = !this.chatWindow || !this.chatWindow.messages;
    return result;
  }
}
