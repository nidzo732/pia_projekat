import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { CompanyInfo, JobApplication, Offer } from 'src/app/misc/models';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  companies:CompanyInfo[]=[];
  offers:Offer[]=[];
  availableAreas:String[]=CompanyInfo.areas;
  areas:String[];
  name:String;
  jobName:String;
  city:String;
  loading:boolean=false;
  kind:String="companies";
  offerTypes=Offer.offerTypes;
  selectedOfferType:String=Offer.offerTypes[0];
  constructor(private companyService:CompanyService, public userService:UserService) { }

  async ngOnInit() {
    this.reSearch();
  }
  async reSearch(){
    this.loading=true;
    this.offers=[];
    this.companies=[];
    if(this.kind=="companies")
    {
        this.companies = await this.companyService.searchCompanies(this.name, this.city, this.areas);
    }
    else
    {
        this.offers=await this.companyService.detailedSearchOffers(this.name, this.jobName, this.selectedOfferType);
    }
    this.loading=false;
  }
  formatDate(date:String):String
  {
      return (new Date(date.toString())).toDateString();
  }
}
