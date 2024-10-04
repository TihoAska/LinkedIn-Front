import { Component } from '@angular/core';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrl: './messaging.component.scss'
})
export class MessagingComponent {

  messageInput : any = '';

  constructor() {
        
  }

  isTextareaEmpty(){
    if(this.messageInput.trim()){
      return false;
    }

    return true;
  }
}
