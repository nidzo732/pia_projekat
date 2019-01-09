import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';
import { Offer, JobApplication } from 'src/app/misc/models';
import { File } from "../../misc/models";
import { UserService } from 'src/app/services/user.service';
import { Config } from 'src/app/misc/config';

@Component({
    selector: 'app-offer-info',
    templateUrl: './offer-info.component.html',
    styleUrls: ['./offer-info.component.css']
})
export class OfferInfoComponent implements OnInit
{
    offer: Offer;
    scores:JobApplication[]=[];
    canApply:boolean=false;
    loading: boolean = true;
    showScores:boolean=false;
    constructor(private route: ActivatedRoute, private companyService: CompanyService, public userService: UserService, private router: Router) { }
    async ngOnInit()
    {
        let offerId = this.route.snapshot.paramMap.get("id");
        let offer = await this.companyService.getOffer(offerId);
        let now=new Date();
        let deadline=new Date(offer.deadline);
        this.showScores=now>deadline;
        if(this.showScores)
        {
            this.scores=await this.companyService.getScores(offerId);
        }
        this.loading = false;
        this.offer = offer;
        this.canApply=deadline>=now;
    }
    formatDate(date: String): String
    {
        if (date)
        {
            return (new Date(date.toString())).toLocaleDateString();
        }
        else
        {
            return "";
        }
    }
    getFileUrl(file: File): String
    {
        return Config.baseServerUrl + `/company/offerfile/${this.offer._id}/${this.offer.files.indexOf(file)}`;
    }
    apply()
    {
        this.router.navigate(["/apply/" + this.offer._id]);
    }
    canListApplications(): boolean
    {
        if(!this.offer) return false;
        return this.userService.currentUser().kind=="company"&&
            this.offer.company==this.userService.currentUser().username;
    }
    listApplications()
    {
        this.router.navigate(["/applicationsforoffer/" + this.offer._id]);
    }

}
