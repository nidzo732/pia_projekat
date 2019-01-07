import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobApplication } from 'src/app/misc/models';
import { CompanyService } from 'src/app/services/company.service';

@Component({
    selector: 'app-applications-for-offer',
    templateUrl: './applications-for-offer.component.html',
    styleUrls: ['./applications-for-offer.component.css']
})
export class ApplicationsForOfferComponent implements OnInit
{
    offerId: String;
    applications: JobApplication[] = [];
    loading: boolean = true;
    constructor(private route: ActivatedRoute, private companyService: CompanyService) 
    {
        this.offerId = route.snapshot.paramMap.get("id");
    }

    async ngOnInit()
    {
        this.applications = await this.companyService.getApplications(this.offerId);
        this.loading = false;
    }

}
