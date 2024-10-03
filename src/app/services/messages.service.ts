import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private baseUrl = environment.baseUrl;

  messageReceiver : BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(private http : HttpClient) { }

  sendMessage(message : Message){
    return this.http.post<any>('api/Messages/SendMessage', message);
  }

  getAllMessagesForUser(userId : number){
    return this.http.get<any>('/api/Messages/GetAllMessagesForUser?userId=' + userId);
  }
}

export interface Message {
  senderId: number,
  receiverId: number,
  content: string,
}
