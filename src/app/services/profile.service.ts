import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private baseUrl = environment.baseUrl;

  public $editExperienceFormValues : BehaviorSubject<any> = new BehaviorSubject<any>({});
  public $editEducationFormValues: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public $editLicenseFormValues: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public $editSkillFormValues: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(private http : HttpClient) { }

  createExperience(createRequest : any){
    return this.http.post('/api/Profile/CreateExperienceForUser', createRequest);
  }

  createEducationForUser(createRequest : any){
    return this.http.post('/api/Profile/CreateEducationForUser', createRequest);
  }

  editExperience(editRequest : any){
    return this.http.put('api/Profile/EditExperienceForUser', editRequest);
  }

  getAllExperiencesForUser(userId : any){
    return this.http.get<any>('/api/Profile/GetAllExperiencesByUserId?id=' + userId);
  }

  getAllInstitutions(){
    return this.http.get<any>('/api/Profile/GetAllInstitutions');
  }

  getAllEducationsForUser(userId : any){
    return this.http.get<any>('/api/Profile/GetAllEducationsByUserId?id=' + userId);
  }

  editEducationForUser(updateRequest : any){
    return this.http.put('/api/Profile/EditEducationForUser', updateRequest);
  }

  getAllLicensesAndCertificationsForUser(userId : any){
    return this.http.get<any>('/api/Profile/GetAllLicensesAndCertificationsByUserId?id=' + userId);
  }

  editLicenseForUser(updateRequest : any){
    return this.http.put('/api/Profile/EditLicenseOrCertificationForUser', updateRequest);
  }

  getAllLanguagesByUserId(userId : any){
    return this.http.get('api/Profile/GetAllLanguagesByUserId?id=' + userId);
  }

  createLanguageForUser(createRequest : any){
    return this.http.post('/api/Profile/CreateLanguageForUser', createRequest);
  }

  editLanguageForUser(updateRequest : any){
    return this.http.put('api/Profile/EditUserLanguage', updateRequest);
  }

  getAllSkills(){
    return this.http.get('/api/Profile/GetAllSkills');
  }

  createSkillForUser(createRequest : any){
    return this.http.post('/api/Profile/CreateSkillForUser', createRequest);
  }
}
