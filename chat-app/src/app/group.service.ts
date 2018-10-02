// group.service.ts
// GroupService
// Exposes functions for managing groups via API calls.

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private api: string = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  // Creates a group by piping `groupName` to the appropriate API route.
  // Returns the result of the API call.
  createGroup(groupName) {
    return this.http.post(this.api + 'group/create/' + groupName, httpOptions);
  }

  // Creates a channel by piping `groupName` and `channelName` to the appropriate API route.
  // Returns the result of the API call.
  createChannel(groupName, channelName) {
    let body = { "groupName": groupName, "channelName": channelName };
    return this.http.post(this.api + 'channel/create', body, httpOptions);
  }

  // Deletes a group by piping `groupName` to the appropriate API route.
  // Returns the result of the API call.
  deleteGroup(groupName) {
    return this.http.delete(this.api + 'group/delete/' + groupName);
  }
  
  // Deletes a channel by piping `channelName` to the appropriate API route.
  // Returns the result of the API call.
  deleteChannel(channelName) {
    return this.http.delete(this.api + 'channel/delete/' + channelName);
  }

  // Gets a list of groups + info by piping the logged-in user + role to the appropriate API route.
  // Returns the result of the API call.
  getGroups(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.api + 'groups', body, httpOptions);
  }

  // Gets all the channels relevant to the given username, group & role. 
  // Returns the result of the API call.
  getChannels(username, group, role) {
    let body = JSON.stringify({ "group": group.name, "username": username, "role": role });
    return this.http.post(this.api + 'channels', body, httpOptions);
  }
}
