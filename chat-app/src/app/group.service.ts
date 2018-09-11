import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, of} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private api:string = 'http://localhost:3000/api/';

  constructor(private http:HttpClient) {}

  createGroup(data){
    let body = JSON.stringify(data);
    return this.http.post(this.api + 'group/create', body, httpOptions);
  }
}
