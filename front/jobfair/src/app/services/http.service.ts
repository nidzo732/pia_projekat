import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { User } from '../misc/models';

class Request
{
  token?:String;
  payload:any;
}
class Response
{
  message:String;
  payload?:any;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient:HttpClient) { }

  async doPostForObject(url:String, data:any):Promise<Response>
  {    
    return new Promise<Response>((resolve, reject)=>{
      var response = this.httpClient.post(url.toString(), {token:this.currentUserToken(), payload:data});
      response.subscribe((response:Response)=>{
        resolve(response);
      });
    })
  }
  currentUserToken():String{
    if(!localStorage["userObject"]) return null;
    let currentUser:User = JSON.parse(localStorage["userObject"]);
    return currentUser.token;
  }
  async doPostForString(url:String, data:any):Promise<String>
  {    
    return new Promise<String>((resolve, reject)=>{
      var response = this.httpClient.post(url.toString(), {token:this.currentUserToken(), payload:data});
      response.subscribe((response:Response)=>{
        resolve(response.message);
      });
    })
  }
}
