import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms'
import {HttpClientModule} from "@angular/common/http"

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { SetPasswordComponent } from './components/set-password/set-password.component';
import { CvEntryComponent } from './components/cv-entry/cv-entry.component';
import { OfferentryComponent } from './components/offerentry/offerentry.component';
import { CompanyInfoComponent } from './components/company-info/company-info.component';
import { OfferInfoComponent } from './components/offer-info/offer-info.component';
import { ApplyToOfferComponent } from './components/apply-to-offer/apply-to-offer.component';
import { MyApplicationsComponent } from './components/my-applications/my-applications.component';
import { MyOffersComponent } from './components/my-offers/my-offers.component';
import { OfferListItemComponent } from './components/offer-list-item/offer-list-item.component';
import { ApplicationListItemComponent } from './components/application-list-item/application-list-item.component';
import { ApplicationsForOfferComponent } from './components/applications-for-offer/applications-for-offer.component';
import { FileListItemComponent } from './components/file-list-item/file-list-item.component';
import { ApplicationInfoComponent } from './components/application-info/application-info.component';
import { FairEntryComponent } from './components/fair-entry/fair-entry.component';
import { AdminConfigComponent } from './components/admin-config/admin-config.component';
import { RatingStarsComponent } from './components/rating-stars/rating-stars.component';
import { FairsComponent } from './components/fairs/fairs.component';
import { FairComponent } from './components/fair/fair.component';
import { FairApplicationComponent } from './components/fair-application/fair-application.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    RegisterComponent,
    SetPasswordComponent,
    CvEntryComponent,
    OfferentryComponent,
    CompanyInfoComponent,
    OfferInfoComponent,
    ApplyToOfferComponent,
    MyApplicationsComponent,
    MyOffersComponent,
    OfferListItemComponent,
    ApplicationListItemComponent,
    ApplicationsForOfferComponent,
    FileListItemComponent,
    ApplicationInfoComponent,
    FairEntryComponent,
    AdminConfigComponent,
    RatingStarsComponent,
    FairsComponent,
    FairComponent,
    FairApplicationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
