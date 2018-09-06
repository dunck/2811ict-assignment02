import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public user;
  public selectedGroup;
  public selectedChannel;
  public groups = [];
  public channels = [];

  constructor(private router: Router) { }

  ngOnInit() {
    if(sessionStorage.getItem('user') === null){
      // User has not logged in, reroute to login
      this.router.navigate(['/login']);
    } else {
      let user = JSON.parse(sessionStorage.getItem('user'));
      this.user = user;
      this.groups = user.groups;

      console.log(this.groups);
    }
    }

  logout(){
    console.log('logout()');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  openGroup(name){
    console.log(name);
    // sessionStorage.setItem('currentGroup', name);
    for(let i = 0; i < this.groups.length; i++){
      if(this.groups[i].name == name){
        this.selectedGroup = this.groups[i];
      }
    }
    this.channels = this.selectedGroup.channels;
  }

  channelChangedHandler(name){
    let found:boolean = false;
    for(let i = 0; i < this.channels.length; i++){
      if(this.channels[i].name == name){
        this.selectedChannel = this.channels[i];
        found = true;
      }
    }
    console.log(this.selectedChannel);
    return found;
  }
  getChannels(groupName){
    let channels = [];
    return channels;
  }
}
