import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from "./guards/login-guard";
import { RegisterComponent } from './components/register/register.component';
import { SetPasswordComponent } from './components/set-password/set-password.component';
import { CvEntryComponent } from './components/cv-entry/cv-entry.component';
import { CvGuard } from './guards/cv.guard';
import { OfferentryComponent } from './components/offerentry/offerentry.component';
import { CompanyInfoComponent } from './components/company-info/company-info.component';
import { OnlyHumanGuard } from './guards/only-human.guard';
import { OnlyCompanyGuard } from './guards/only-company.guard';
import { OfferInfoComponent } from './components/offer-info/offer-info.component';
import { ApplyToOfferComponent } from './components/apply-to-offer/apply-to-offer.component';
import { MyApplicationsComponent } from './components/my-applications/my-applications.component';
import { MyOffersComponent } from './components/my-offers/my-offers.component';
import { ApplicationsForOfferComponent } from './components/applications-for-offer/applications-for-offer.component';
import { ApplicationInfoComponent } from './components/application-info/application-info.component';

const routes: Routes = [
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    {
        path: "", canActivate: [CvGuard], children: [
            { path: "", redirectTo: "/dashboard", pathMatch: "full" },
            { path: "dashboard", component: DashboardComponent },
            { path: "company/:name", component: CompanyInfoComponent },
        ]
    },
    { path: "myoffers", component: MyOffersComponent, canActivate: [OnlyCompanyGuard] },
    { path: "applicationinfo", component: ApplicationInfoComponent, canActivate: [OnlyCompanyGuard] },
    { path: "applicationsforoffer/:id", component: ApplicationsForOfferComponent, canActivate: [OnlyCompanyGuard] },
    { path: "myapplications", component: MyApplicationsComponent, canActivate: [OnlyHumanGuard] },
    { path: "apply/:id", component: ApplyToOfferComponent, canActivate: [OnlyHumanGuard] },
    { path: "offerinfo/:id", component: OfferInfoComponent, canActivate: [CvGuard] },
    { path: "setpassword", canActivate: [LoginGuard], component: SetPasswordComponent },
    { path: "cventry", component: CvEntryComponent, canActivate: [OnlyHumanGuard] },
    { path: "offerentry", component: OfferentryComponent, canActivate: [OnlyCompanyGuard] },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
