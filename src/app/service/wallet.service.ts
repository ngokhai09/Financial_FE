import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

const API = 'http://localhost:8080/api/wallets'

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(private httpClient: HttpClient) { }

  findAll(): Observable<any> {
    return this.httpClient.get(API + '/find-by-user/' + localStorage.getItem('ID'));
  }

  findById(id: number): Observable<any> {
    return this.httpClient.get(API + '/' + id);
  }

  save(wallet: any): Observable<any> {
    return this.httpClient.post(API, wallet);
  }

  updateNormal(id: any, wallet: any): Observable<any> {
    return this.httpClient.put(API + '/' + id, wallet);
  }

  update(id: number, wallet: any): Observable<any> {
    return this.httpClient.put(API + '/edit-money-type/'+ id, wallet);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(API + '/' + id);
  }

  updateStatus(id: number, wallet: any): Observable<any> {
    return this.httpClient.put(API + '/update-status/' + id, wallet);
  }
}
