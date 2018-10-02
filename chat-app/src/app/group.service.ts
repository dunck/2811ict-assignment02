// ============================================
// This service is responsible for CRUD actions 
// to the group APIs
// ============================================

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

  createGroup(groupName) {
    // let body = JSON.stringify(data);
    return this.http.post(this.api + 'group/create/' + groupName, httpOptions);
  }

  createChannel(groupName, channelName) {
    let body = { "groupName" : groupName, "channelName" : channelName };
    return this.http.post(this.api + 'channel/create', body, httpOptions);
  }

  deleteGroup(groupName, username) {
    return this.http.delete(this.api + 'group/delete/' + groupName);
  }

  deleteChannel(channelName) {
    return this.http.delete(this.api + 'channel/delete/' + channelName);
  }

  getGroups(data) {
    let body = JSON.stringify(data);
    console.log("getGroups(data)");
    console.log(body);
    let ret = this.http.post(this.api + 'groups', body, httpOptions);
    // setTimeout(null, 3000);
    // console.log(ret);
    return ret;
  }

  getChannels(username, group, role) {
    let body = JSON.stringify({ "group": group.name, "username": username, "role": role });
    console.log(`Group:`);
    console.log(body);
    let ret = this.http.post(this.api + 'channels', body, httpOptions);
    return ret;
  }

}
