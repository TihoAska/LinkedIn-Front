import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket: WebSocket | null = null;
  private messageSubject: BehaviorSubject<any> = new BehaviorSubject<any>('Initial value');
  public newMessage: BehaviorSubject<any> = new BehaviorSubject<any>('');
  
  constructor(public userService : UserService) {
    
  }

  initWebSocketService(){
    let accessToken = localStorage.getItem('accessToken');
    this.socket = new WebSocket('wss://localhost:7285/Connections?accessToken=' + accessToken);

    // Handle incoming messages
    this.socket.onmessage = (event) => {
      let parsedData = JSON.parse(event.data);

      this.messageSubject.next(parsedData);
      
      switch(parsedData.EventType) {
        case 'connection': 
          this.userService.$receivedConnection.next(parsedData);
          break;
        case 'message':
          this.newMessage.next(parsedData.Data);
          break;
        case 'post':
          console.log(parsedData.Data);
          break;
      }
    };

    // Handle WebSocket errors
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Handle WebSocket close
    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  // Observable to listen to WebSocket messages
  onMessage(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  // Method to send data to the server
  sendMessage(message: any) {
    this.socket?.send(JSON.stringify(message));
  }
}
