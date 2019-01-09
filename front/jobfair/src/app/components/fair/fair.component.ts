import { Component, OnInit } from '@angular/core';
import { FairsService } from 'src/app/services/fairs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FairJSON, Fair, FairEvent, FairApplication } from 'src/app/misc/models';
import { UserService } from 'src/app/services/user.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
    selector: 'app-fair',
    templateUrl: './fair.component.html',
    styleUrls: ['./fair.component.css']
})
export class FairComponent implements OnInit
{
    fairj:FairJSON;
    fair:Fair;
    imgSrc:String="";
    oldApplication:FairApplication;
    loading:boolean=true;
    constructor(private fairsService:FairsService, 
        private route:ActivatedRoute, 
        private userService:UserService, 
        private router:Router,
        private companyService:CompanyService) { }

    async ngOnInit()
    {
        let id=this.route.snapshot.paramMap.get("id");
        this.fairj=await this.fairsService.getFair(id);
        if(this.userService.loggedIn && this.userService.currentUser().kind=="company")
        {
            this.oldApplication=await this.companyService.getFairApplication(id);
        }
        this.loading=false;
        this.fair=this.fairj.Fairs[0];
        this.imgSrc=this.fairsService.getPictureUrl(id);
    }
    formatDate(date:String)
    {
        if(!date) return "";
        return (new Date(date.toString())).toLocaleDateString();
    }
    formatTime(time:String)
    {
        if(!time) return "";
        return (new Date("2015-01-01 "+time.toString())).toLocaleTimeString();
    }
    showPackages():boolean
    {
        return this.userService.loggedIn && ( this.userService.currentUser().kind=="company" || this.userService.currentUser().kind=="admin");
    }
    canApply():boolean
    {
        if(!this.fairj) return false;
        if(!this.fair) return false;
        let deadline=new Date(this.fair.Deadline.toString());
        let now=new Date();
        if(deadline<now) return false;
        return this.userService.loggedIn && this.userService.currentUser().kind=="company"
            && (!this.oldApplication || this.oldApplication.status=="Pending");
    }
    canEdit()
    {
        return this.userService.loggedIn && this.userService.currentUser().kind=="admin";
    }
    edit()
    {
        this.router.navigate(["/fairentry/"+this.fairj._id]);
    }
    apply()
    {
        this.router.navigate(["/fairapply/"+this.fairj._id]);
    }
    manageApps()
    {
        this.router.navigate(["/manageapps/"+this.fairj._id]);
    }
}
