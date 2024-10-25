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
  public $editLanguageFormValues: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public $editSkillFormValues: BehaviorSubject<any> = new BehaviorSubject<any>({});

  public $showAddTimelineWindow: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public $showIssuingOrganizationImage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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

  createLicenseForUser(createRequest : any){
    return this.http.post('/api/Profile/CreateLicenseForUser', createRequest);
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

  deleteLanguageForUser(deleteRequest : any){
    return this.http.delete('api/Profile/DeleteLanguageForUser?userId=' + deleteRequest.userId + '&languageId=' + deleteRequest.languageId);
  }

  deleteEducationForUser(deleteRequest : any){
    return this.http.delete('api/Profile/DeleteEducationForUser?educationId=' + deleteRequest.educationId + '&userId=' + deleteRequest.userId);
  }

  deleteExperience(deleteRequest : any){
    return this.http.delete('api/Profile/DeleteExperienceForUser?userId=' + deleteRequest.userId + '&experienceId=' + deleteRequest.experienceId);
  }

  deleteLicense(deleteRequest : any){
    return this.http.delete('/api/Profile/DeleteLicenseForUser?userId=' + deleteRequest.userId + '&licenseId=' + deleteRequest.licenseId);
  }

  getAllSkills(){
    return this.http.get('/api/Profile/GetAllSkills');
  }

  createSkillForUser(createRequest : any){
    return this.http.post('/api/Profile/CreateSkillForUser', createRequest);
  }

  deleteUserSkill(userId : any, skillName : any, skillDescription : any){
    return this.http.delete('/api/Profile/DeleteUserSkill?userId=' + userId + '&skillName=' + skillName + '&skillDescription=' + skillDescription);
  }

  changeBackgroundImage(updateRequest : any){
    return this.http.put<any>('/api/Profile/ChangeBackgroundImage', updateRequest);
  }
}
