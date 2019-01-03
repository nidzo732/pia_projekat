import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { CompanyInfo } from 'src/app/misc/models';

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
  constructor(private companyService:CompanyService) { }

  async ngOnInit() {
    this.companies = await this.companyService.search(null,null,null);
  }
  async reSearch(){
    console.log(this.areas);
    this.companies = await this.companyService.search(this.name, this.city, this.areas);
  }
}
