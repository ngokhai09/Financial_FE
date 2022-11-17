import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject, map, Observable} from "rxjs";
import {User} from "../model/user";
import {UserToken} from "../model/user-token";

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<UserToken>;
  public currentUser: string | null | any
  update = new EventEmitter<string>();
  constructor(private httpClient : HttpClient) {
    this.currentUserSubject = new BehaviorSubject<UserToken>(JSON.parse(<string>localStorage.getItem('currentUser')));
    this.currentUser = localStorage.getItem('currentUser');
  }

  public get currentUserValue() : UserToken {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.httpClient.post<any>(API_URL + 'api/login', {username, password})
      .pipe(map(user => {localStorage.setItem('currentUser', JSON.stringify(user.data));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('USERNAME');
    localStorage.removeItem('ROLE');
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('PASS');
    localStorage.removeItem('AVATAR');
    localStorage.removeItem('ID');
  }


}
