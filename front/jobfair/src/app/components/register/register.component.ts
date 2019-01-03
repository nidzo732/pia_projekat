import { Component, OnInit } from '@angular/core';
import { User, CompanyInfo } from 'src/app/misc/models';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { FileLoader } from 'src/app/misc/fileLoader';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user:User={username:"",companyInfo:{}, humanInfo:{}, kind:"human"};
  pictUrlDummy:any;
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
      this.router.navigate(["/dashboard"]);
    }
    else{
      this.errMsg=result;
    }
  }
  async pictureChange(event:any){
    if(event.target.files && event.target.files[0])
    {
      let file=event.target.files[0];
      let loadedFile = await FileLoader.loadFile(file);      
      if(!loadedFile.mime.startsWith("image/"))
      {
        this.pictUrlDummy=null;
      }
      else
      {
        this.user.picture=loadedFile.content64;
      }
    }
  }

}
