import { Component, OnInit } from '@angular/core';
import { Offer } from 'src/app/misc/models';
import { UserService } from 'src/app/services/user.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
    selector: 'app-my-offers',
    templateUrl: './my-offers.component.html',
    styleUrls: ['./my-offers.component.css']
})
export class MyOffersComponent implements OnInit
{
    offers:Offer[]=[];
    loading:boolean=true;
    constructor(private userService:UserService, private companyService:CompanyService) { }

    async ngOnInit()
    {
        this.offers=await this.companyService.searchOffers(this.userService.currentUser().username);
        this.loading=false;
    }

}
