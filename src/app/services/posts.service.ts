import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  $posts : BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(private http : HttpClient, public userService : UserService) { }

  getAllPostsForUser(userId : number){
    return this.http.get<any>('api/Posts/GetAllForUser?userId=' + userId);
  }

  getAllConnectionsPosts(userId : number){
    return this.http.get<any>('/api/Posts/GetAllConnectionsPosts?userId=' + userId);
  }

  reactOnPost(reactionModel : any){
    return this.http.put<any>('api/Posts/ReactOnPost', reactionModel);
  }

  createPost(createRequest : object){
    const accessToken = localStorage.getItem('accessToken');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
    });

    return this.http.put<any>('/api/Posts/Create', createRequest, { headers });
  }
}
