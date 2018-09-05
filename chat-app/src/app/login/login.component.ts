import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public username:string;
  private password:string;

  constructor(private router:Router, private form:FormsModule, private _userService:UserService) {}

  ngOnInit() {
  }

  loginUser(event){
    event.preventDefault();
    console.log(this.username);
    console.log(this.password);
    let user = {
      'username': this.username,
      'password': this.password
    }

    
    this._userService.login(user).subscribe(
      data => { 
        console.log(data);
        if(data != false){
          let temp = JSON.stringify(data);
          sessionStorage.setItem('user', temp);
          sessionStorage.setItem('username', this.username);
          //return true;
          
         this.router.navigate(['/home']); 
        }
      },
      error => {
        console.error(error);
      }
    )
  }

}
