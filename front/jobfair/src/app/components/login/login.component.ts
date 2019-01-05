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
  loading:boolean=false;
  constructor(private userService:UserService, private router:Router) { }
  ngOnInit() {
  }
  async doLogin(){
    this.loading=true;
    var result:String = await this.userService.logIn(this.model.username, this.model.password);
    this.loading=false;
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
