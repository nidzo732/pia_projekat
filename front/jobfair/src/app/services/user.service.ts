import { Injectable } from '@angular/core';
import { User, CV } from "../misc/models";
import { HttpService } from './http.service';


const siteUrl = "http://localhost:4242";
const registerUrl = siteUrl + "/user/register";
const loginUrl = siteUrl + "/user/login";
const setPasswordUrl = siteUrl + "/user/setpwd";
const setCVUrl = siteUrl + "/user/setcv";
const pictureUrl=siteUrl+"/user/picture";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public loggedIn: boolean;
  async logIn(username: String, password: String): Promise<String> {
    let response = await this.httpService.doPostForObject(loginUrl, { username: username, password: password });
    if (response.message != "OK") {
      return response.message;
    }
    let user: User = response.payload;
    localStorage["userObject"] = JSON.stringify(user);
    this.loggedIn = true;
    return "OK";
  }
  currentUser(): User {
    if (!localStorage["userObject"]) return null;
    return JSON.parse(localStorage["userObject"]);
  }
  async logOut() {
    localStorage.removeItem("userObject");
    this.loggedIn = false;
  }
  async doRegister(user: User): Promise<String> {
    let result = await this.httpService.doPostForString(registerUrl, user);
    return result;
  }
  async setPassword(oldPassword: String, newPassword: String): Promise<String> {
    let response = await this.httpService.doPostForString(setPasswordUrl, { oldPassword: oldPassword, newPassword: newPassword });
    return response;
  }
  async enterCV(cv: CV):Promise<String> {
    let current = this.currentUser();
    let response = await this.httpService.doPostForString(setCVUrl, cv);
    if(response=="OK")
    {
      current.humanInfo.cv = cv;
      localStorage["userObject"] = JSON.stringify(current);
    }
    return response;
  }
  getPictureUrl(username:String):String{
    return pictureUrl+"/"+username;
  }
  constructor(private httpService: HttpService) {
    if (localStorage["userObject"]) {
      this.loggedIn = true;
    }
    else {
      this.loggedIn = false;
    }
  }
  ngOnInit() {
  }
}
