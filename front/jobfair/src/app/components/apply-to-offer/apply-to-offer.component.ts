import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Offer, JobApplication } from 'src/app/misc/models';
import { CompanyService } from 'src/app/services/company.service';
import { UserService } from 'src/app/services/user.service';
import { loadInternal } from '@angular/core/src/render3/util';
import { FileLoader } from 'src/app/misc/fileLoader';

@Component({
    selector: 'app-apply-to-offer',
    templateUrl: './apply-to-offer.component.html',
    styleUrls: ['./apply-to-offer.component.css']
})
export class ApplyToOfferComponent implements OnInit
{
    offer: Offer;
    loading: boolean = true;
    errMsg: String;
    infoMsg: String;
    canApply:boolean=false;
    application: JobApplication = {

    };
    constructor(private route: ActivatedRoute,
        private companyService: CompanyService,
        private userService: UserService) { }

    async ngOnInit()
    {
        let offerId = this.route.snapshot.paramMap.get("id");
        this.offer = await this.companyService.getOffer(offerId);
        this.loading = false;
        let now=new Date();
        let deadline=new Date(this.offer.deadline);
        this.canApply=deadline>=now;
    }
    async fileChange(event: any)
    {
        if (event.target.files && event.target.files[0])
        {
            let filePath = event.target.files[0];
            let loadedFile = await FileLoader.loadFile(filePath);
            this.application.coverLetterUpload={
                content64:loadedFile.content64,
                mimeType:loadedFile.mime,
                name:loadedFile.name
            } ;
        }
        else
        {
            this.application.coverLetterUpload = null;
        }
    }
    async apply()
    {
        window.scrollTo(0, 0);
        this.errMsg = "";
        this.infoMsg = "";
        if (!this.application.coverLetterUpload && !this.application.coverLetter)
        {
            this.errMsg = "Please either upload or enter your cover letter";
            return;
        }
        this.application.offerId=this.offer._id;
        this.loading = true;
        let response = await this.userService.applyToOffer(this.application);
        this.loading = false;
        if (response == "OK")
        {
            this.infoMsg = "Application sent successfully";
        }
        else
        {
            this.errMsg = response;
        }

    }

}
