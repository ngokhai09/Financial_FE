import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/user";

const API_URL = environment.apiUrl + "api/users";
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient : HttpClient) { }

  showAllUser() :Observable<any> {
    return this.httpClient.get(API_URL)
  }

  register(user: User): Observable<any> {
    return this.httpClient.post<any>( environment.apiUrl + 'api/register', user);
  }

  registerSuccess(token: string): Observable<any> {
    return this.httpClient.get<any>(API_URL + '/confirm-account?token=' + token);
  }

  login(user: User): Observable<any> {
    return this.httpClient.post<any>(environment.apiUrl + 'api/login', user);
  }

  changePass(id: any, user: User): Observable<any> {
    console.log(API_URL + `/users/${id}`);
    return this.httpClient.put<any>(API_URL + `/${id}` , user)
  }

  updateUserProfile(id: any, user: User): Observable<any> {
    return this.httpClient.put<any>(API_URL + `/update-profile/${id}` , user);
  }

  findById(id: any) : Observable<any> {
    return this.httpClient.get<any>(API_URL + `/${id}` )
  }

  findByUsername(username: any) : Observable<any> {
    return this.httpClient.get<any>(API_URL + `/find-by-username/${username}` )
  }
}
