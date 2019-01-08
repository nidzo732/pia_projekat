import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class AdminOnlyGuard implements CanActivate
{
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
    {
        if (!this.userService.loggedIn || this.userService.currentUser().kind!="admin")
        {
            this.router.navigate(["/"]);
            return false;
        }
        return true;
    }
    constructor(private userService: UserService, private router: Router)
    {

    }
}
