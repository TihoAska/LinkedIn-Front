import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  public followPage(request : any){
    return this.http.put(this.baseUrl + '/api/Page/Follow', request);
  }

  public unfollowPage(userId: string, pageName: string){
    const params = new HttpParams()
        .set('userId', userId)
        .set('pageName', pageName);
        
    return this.http.delete('/api/Page/Unfollow', { params });
  }

  public getAllPagesForUser(){
    return this.http.get('/api/Page/GetAllPagesForUser?userId=' + this.userService.$loggedUser.value.id);
  }

  public getTwoPages(){
    return this.http.get<any>('/api/Page/Get2PagesYouMightLike?userId=' + this.userService.$loggedUser.value.id);
  }

  public getCompanyLocationByCityName(cityName : any){
    return this.http.get<any>('api/Page/GetCompanyLocationByCityName?cityName=' + cityName);
  }

  public getCompanyLocationByLocationId(locationId : any){
    return this.http.get<any>('api/Page/GetCompanyLocationByLocationId?locationId=' + locationId);
  }

  public getAllCompanyLocations(){
    return this.http.get<any>('api/Page/GetAllCompanyLocations');
  }

  public getAllCompanies(){
    return this.http.get<any>('api/Page/GetAll');
  }

  public getCompanyByName(name : any){
    return this.http.get<any>('api/Page/GetByName?name=' + name);
  }

  public getCompanyById(id : any){
    return this.http.get<any>('/api/Page/GetById');
  }
}
