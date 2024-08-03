import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  private baseUrl = environment.baseUrl;

  public $twoPages : BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(
    private http : HttpClient,
    private userService : UserService) { }

  public getPageByName(pageName : string){
    return this.http.get(this.baseUrl + '/api/Page/GetByName?name=' + pageName).subscribe(res => {
      console.log(res);
    });
  }

  public followPage(pageName : string){
    const body = { userId: 2, pageName: pageName };

    return this.http.put(this.baseUrl + '/api/Page/Follow', body).subscribe(res => {
      console.log(res);
    });
  }

  public getTwoPages(){
    return this.http.get<any>('/api/Page/Get2PagesYouMightLike?userId=' + this.userService.$loggedUser.value.id);
  }
}
