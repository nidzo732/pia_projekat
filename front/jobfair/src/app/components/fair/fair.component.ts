import { Component, OnInit } from '@angular/core';
import { FairsService } from 'src/app/services/fairs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FairJSON, Fair, FairEvent } from 'src/app/misc/models';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-fair',
    templateUrl: './fair.component.html',
    styleUrls: ['./fair.component.css']
})
export class FairComponent implements OnInit
{
    fairj:FairJSON;
    fair:Fair={};
    imgSrc:String="";
    loading:boolean=true;
    constructor(private fairsService:FairsService, private route:ActivatedRoute, private userService:UserService, private router:Router) { }

    async ngOnInit()
    {
        let id=this.route.snapshot.paramMap.get("id");
        this.fairj=await this.fairsService.getFair(id);
        this.loading=false;
        this.fair=this.fairj.Fairs[0];
        console.log(this.fairj);
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
        let deadline=new Date(this.fair.Deadline.toString());
        let now=new Date();
        if(deadline<now) return false;
        return this.userService.loggedIn && this.userService.currentUser().kind=="company";
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
        this.router.navigate(["/fairapply"+this.fairj._id]);
    }
}
