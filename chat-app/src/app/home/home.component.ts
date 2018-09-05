import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public groups = [];

  constructor(private router: Router) { }

  ngOnInit() {
    if(sessionStorage.getItem('username') === null){
      // User has not logged in, reroute to login
      this.router.navigate(['/login']);
    } else {
      let user = JSON.parse(sessionStorage.getItem('user'));
      console.log(user.member);
      this.groups = user.member;
      console.log(this.groups);

    }
  }

}
