import { Component, OnInit } from '@angular/core';
import { CompanyInfo, Offer } from 'src/app/misc/models';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-company-info',
    templateUrl: './company-info.component.html',
    styleUrls: ['./company-info.component.css']
})
export class CompanyInfoComponent implements OnInit
{
    loading: boolean = true;
    offersLoading = true;
    offers: Offer[];
    companyInfo: CompanyInfo = {

    };
    constructor(private route: ActivatedRoute, private companyService: CompanyService, public userService: UserService) { }

    async ngOnInit()
    {
        let companyUsername = this.route.snapshot.paramMap.get("name");
        this.companyInfo = await this.companyService.getCompany(companyUsername);
        if (!this.companyInfo.site.startsWith("http://") && !this.companyInfo.site.startsWith("https://"))
        {
            this.companyInfo.site = "http://" + this.companyInfo.site;
        }
        this.loading = false;
        this.offers = await this.companyService.searchOffers(companyUsername);
        this.offersLoading = false;
    }
}
