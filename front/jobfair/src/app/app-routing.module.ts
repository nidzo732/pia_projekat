import { NgModule } from '@angular/core';
import {LoginComponent} from './components/login/login.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import {LoginGuard} from "./guards/login-guard";
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {path:"login", component:LoginComponent},
  {path:"register", component:RegisterComponent},
  {path:"user", canActivate:[LoginGuard], children:[
    {path:"dashboard", component:DashboardComponent}
  ]},
  {path:"", redirectTo:"/user/dashboard", pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
