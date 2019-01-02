import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'jobfair';
  constructor(public userService:UserService, private router:Router)
  {

  }
  ngOnInit(){
      
  }
  doLogout(){
    this.userService.logOut();
    this.router.navigate(["/login"]);
  }
}
