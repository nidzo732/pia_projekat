import { Injectable } from '@angular/core';
import {User} from "../misc/models"

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public loggedIn:boolean;
  private users:User[]=[];
  async logIn(username:String, password:String):Promise<String>
  {
    var foundUser:User=null;
    this.users.forEach(existing => {
      if(existing.username==username && existing.password==password)
      {
        foundUser=existing;
      }
    });
    if(foundUser)
    {
      localStorage["userObject"]=JSON.stringify(foundUser);
      this.loggedIn=true;
      return "OK";
    }
    return "Invalid credentials"
  }
  async currentUser():Promise<User>{
    return JSON.parse(localStorage["userObject"]);
  }
  async logOut()
  {
    localStorage.removeItem("userObject");
    this.loggedIn=false;
  }
  async doRegister(user:User):Promise<String>
  {
      var alreadyExists:boolean=false;
      this.users.forEach(existing => {
        if(existing.username==user.username) alreadyExists=true;
        
      });
      if(alreadyExists) return "User already exists";
      this.users.push(user);
      return "OK"
  }
  async setPassword(oldPassword:String, newPassword:String):Promise<String>
  {
      let current=await this.currentUser();
      if(current.password!=oldPassword)
      {
        return "Invalid old password";
      }
      else
      {
        current.password=newPassword;
        localStorage["userObject"]=JSON.stringify(current);
        return "OK";
      }
  }
  constructor() { 
    if(localStorage["userObject"])
    {
      this.loggedIn=true;
    }
    else
    {
      this.loggedIn=false;
    }
  }
  ngOnInit(){
  }
}
