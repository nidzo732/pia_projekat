import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent implements OnInit {
  password:String;
  newPassword:String;
  errMsg:String;
  notifMsg:String;
  constructor(private userService:UserService) { }

  ngOnInit() {
  }
  async setPassword(){
    let response=await this.userService.setPassword(this.password, this.newPassword);
    this.errMsg="";
    this.notifMsg="";
    if(response=="OK")
    {
      this.notifMsg="Password set successfully";
    }
    else
    {
      this.errMsg=response;
    }
  }

}
