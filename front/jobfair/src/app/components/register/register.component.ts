import { Component, OnInit } from '@angular/core';
import { User, CompanyInfo } from 'src/app/misc/user';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user:User={username:"",companyInfo:{}, humanInfo:{}, kind:"human"};
  errMsg:String;
  availableAreas:String[];
  constructor(private userService:UserService,
              private router:Router) { this.availableAreas=CompanyInfo.areas;}
  dc(){
    console.log(this.user.humanInfo.graduated);
  }
  ngOnInit() {
  }
  async doRegister(){
    var result=await this.userService.doRegister(this.user);
    if(result=="OK")
    {
      await this.userService.logIn(this.user.username, this.user.password);
      this.router.navigate(["/user/dashboard"]);
    }
    else{
      this.errMsg=result;
    }
  }

}
