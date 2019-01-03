import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router:Router, private userService:UserService){

  }
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      console.log("UUU");
        console.log(state);
    if(!this.userService.loggedIn)
    {
      this.router.navigate(["/login"]);
      return false;
    }
    let user=await this.userService.currentUser();
    if(user.kind=="human" && user.humanInfo.cv==null)
    {
      if(state.url!="/user/cventry")
      {
        this.router.navigate(["/user/cventry"]);
        return false;
      }
    }
    return true;
  }
}
