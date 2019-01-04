import { NgModule } from '@angular/core';
import {LoginComponent} from './components/login/login.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import {LoginGuard} from "./guards/login-guard";
import { RegisterComponent } from './components/register/register.component';
import { SetPasswordComponent } from './components/set-password/set-password.component';
import { CvEntryComponent } from './components/cv-entry/cv-entry.component';
import { CvGuard } from './guards/cv.guard';

const routes: Routes = [
  {path:"login", component:LoginComponent},
  {path:"register", component:RegisterComponent},
  {path:"dashboard", component:DashboardComponent, canActivate:[CvGuard]},
  {path:"user", canActivate:[LoginGuard], children:[
    {path:"setPassword", component:SetPasswordComponent},
    {path:"cventry", component:CvEntryComponent}
  ]},
  {path:"", redirectTo:"/dashboard", pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
