import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public $otherSimilarProfiles : BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public $peopleYouMayKnow : BehaviorSubject<any> = new BehaviorSubject<any>([]);

  public otherSimilarProfiles : any = [];
  public peopleYouMayKnow : any = [];

  public $loggedUser : BehaviorSubject<any> = new BehaviorSubject<any>(new User);

  constructor(
    private http : HttpClient,
    private jwtHelper : JwtHelperService) {

  }

  public decodeUserFromToken(accessToken : any){
    let tokenPayload = this.jwtHelper.decodeToken(accessToken);

    let user : User = {
      id: tokenPayload.Id,
      email: tokenPayload.Email,
      firstName: tokenPayload.FirstName,
      lastName: tokenPayload.LastName,
    }

    return user;
  } 

  getFiveUsers(){
    return this.http.get<any>('/api/User/GetFiveUsers');
  }

  getFiveOtherSimilarProfiles(){
    return this.http.get<any>('api/User/GetFiveOtherSimilarProfiles?id=' + this.$loggedUser.value.id);
  }

  getFivePeopleYouMayKnow(){
    return this.http.get<any>('/api/User/GetFivePeopleYouMayKnow?id=' + this.$loggedUser.value.id);
  }

  getUserByEmail(email: any){
    return this.http.get<any>('/api/User/GetByEmail?email=' + email);
  }

  createUser(userToRegister : any){
    return this.http.post<any>('/api/User/Create', userToRegister);
  }

  login(userToLogin : any){
    return this.http.post<any>('api/User/Login', userToLogin);
  }

  getUserById(id : any){
    return this.http.get<any>('/api/User/GetById?id=' + id);
  }

  sendConnection(senderId : number, receiverId : number){
    return this.http.post<any>('/api/Connections/SendConnection?senderId=' + senderId + '&receiverId=' + receiverId, {});
  }

  getUserByIdWithUserDetails(id : any){
    return this.http.get<any>('api/User/GetByIdWithUserDetails?id=' + id);
  }
}

export class User{
  id?: number = -1;
  firstName?: string;
  lastName?: string;
  email?: string;
  job?: string;
  education?: string;

  constructor(id?: number, firstName?: string, lastName?: string, email?: string, job?: string, education?: string) {
    this.id = id;
    this.firstName =  firstName;
    this.lastName = lastName;
    this.email = email;
    this.job = job;
    this.education = education;
  }
}
