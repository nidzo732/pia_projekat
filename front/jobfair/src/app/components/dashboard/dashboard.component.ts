import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { CompanyInfo } from 'src/app/misc/models';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  companies:CompanyInfo[]=[];
  availableAreas:String[]=CompanyInfo.areas;
  areas:String[];
  name:String;
  city:String;
  loading:boolean=false;
  constructor(private companyService:CompanyService, public userService:UserService) { }

  async ngOnInit() {
    this.reSearch();
  }
  async reSearch(){
    this.loading=true;
    this.companies = await this.companyService.searchCompanies(this.name, this.city, this.areas);
    this.loading=false;
  }
}
