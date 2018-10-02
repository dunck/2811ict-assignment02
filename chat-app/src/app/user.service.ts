// user.service.ts
// UserService
// Exposes functions for managing users via API calls.

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private api: string = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  // Process user login by piping the username and password to the appropriate API route.
  // Returns the result of that API call (truthy).
  login(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.api + 'login', body, httpOptions);
  }

  // Creates a user by piping the username, password & role to the appropriate API route.
  // Returns the result of that API call (truthy).
  create(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.api + 'user/create', body, httpOptions);
  }

  // Deletes a user by piping the username to the appropriate API route.
  // Returns the result of that API call (truthy).
  delete(username) {
    return this.http.delete(this.api + 'user/delete/' + username);
  }
}
