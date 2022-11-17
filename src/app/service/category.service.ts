import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

const API = 'http://localhost:8080/api/categories'

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClient: HttpClient) {}

  findAll(): Observable<any> {
    return this.httpClient.get(API + '/find-by-user/' + localStorage.getItem('ID'));
  }

  findById(id: number): Observable<any> {
    return this.httpClient.get(API + '/' + id);
  }

  findByStatus(num: number): Observable<any> {
    return this.httpClient.get(API + `/find-by-status/${num}`);
  }

  save(category: any): Observable<any> {
    return this.httpClient.post(API, category);
  }

  update(id: number, category: any): Observable<any> {
    return this.httpClient.put(API + `/${id}`, category);
  }

  delete(id: any):Observable<any>{
    return this.httpClient.delete(API + `/${id}`);
  }
}
