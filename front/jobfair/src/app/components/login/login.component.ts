import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model:any={username:"", password:""};
  errMsg:String;
  constructor(private userService:UserService, private router:Router) { }

  ngOnInit() {
  }
  async doLogin(){
    var result:String = await this.userService.logIn(this.model.username, this.model.password);
    if(result=="OK")
    {
      this.router.navigate(["/dashboard"]);
    }
    else
    {
      this.errMsg=result;
    }
  }

}
