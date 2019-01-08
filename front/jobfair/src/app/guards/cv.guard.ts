import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class CvGuard implements CanActivate {
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      let user=this.userService.currentUser();
      if(user!=null && user.kind=="human" && user.humanInfo.cv==null && !user.admin)
      {
        if(state.url!="/cventry")
        {
          this.router.navigate(["/cventry"]);
          return false;
        }
      }
      return true;
  }
  constructor(private router:Router, private userService:UserService){}
}
