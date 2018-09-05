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
  }

  getChannels(groupName){
    let channels = [];
    return channels;
  }
}
