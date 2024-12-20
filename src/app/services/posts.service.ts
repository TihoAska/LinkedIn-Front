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

  getAllConnectionsAndUserPosts(userId : number){
    return this.http.get('api/Posts/GetAllConnectionAndUserPosts?userId=' + userId);
  }

  reactOnPost(reactionModel : any){
    return this.http.post<any>('api/Posts/ReactOnPost', reactionModel);
  }

  commentOnPost(createRequest : any){
    return this.http.post<any>('api/Posts/CommentOnPost', createRequest);
  }

  reactOnComment(createRequest : any){
    return this.http.post<any>('api/Posts/ReactOnComment', createRequest);
  }

  createPost(createRequest : object){
    const accessToken = localStorage.getItem('accessToken');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
    });

    return this.http.post<any>('/api/Posts/Create', createRequest, { headers });
  }
}
