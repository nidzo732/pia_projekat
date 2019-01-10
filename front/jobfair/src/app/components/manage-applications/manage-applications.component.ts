import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin-service';
import { FairsService } from 'src/app/services/fairs.service';
import { ActivatedRoute } from '@angular/router';
import { FairApplication, FairJSON, CompanyEvent } from 'src/app/misc/models';

@Component({
    selector: 'app-manage-applications',
    templateUrl: './manage-applications.component.html',
    styleUrls: ['./manage-applications.component.css']
})
export class ManageApplicationsComponent implements OnInit
{
    loading: boolean = true;
    errMsg: String;
    ok:boolean=false;
    infoMsg: String;
    applications: FairApplication[];
    approvals: boolean[];
    packages: String[];
    fairj: FairJSON;

    constructor(private adminService: AdminService,
        private fairsService: FairsService,
        private route: ActivatedRoute) { }

    async ngOnInit()
    {
        let id = this.route.snapshot.paramMap.get("id");
        this.applications = await this.adminService.getFairApplications(id);
        this.fairj = await this.adminService.getFair(id);
        if (!this.fairj.CompanyEvents)
        {
            this.fairj.CompanyEvents = [];
        }
        this.approvals = [];
        this.packages = [];
        for (let i = 0; i < this.applications.length; i++)
        {
            if (this.applications[i].status == "Accepted") this.approvals.push(true);
            else this.approvals.push(false);
            this.packages.push(this.fairj.packages.Packages[this.applications[i].package].Title);
        }
        this.loading = false;
        this.checkIfOk();
    }
    removeFromEvents(description:String)
    {
        this.fairj.CompanyEvents.forEach(x=>{
            if(x.description==description)
            {
                x.approved=false;
            }
        });
    }
    addToEvents(description:String, cnt:number)
    {
        
        if(!this.fairj.CompanyEvents.find(x=>
            x.description==description))
        {
            for(let i=0;i<cnt;i++)
            {
                this.fairj.CompanyEvents.push({description:description, approved:true});
            }
        }
        else
        {
            this.fairj.CompanyEvents.forEach(x=>{
                if(x.description==description) x.approved=true;
            })
        }
    }
    getManagedEvents():CompanyEvent[]
    {
        if(!this.fairj || !this.fairj.CompanyEvents) return [];
        return this.fairj.CompanyEvents.filter(x=>x.approved);
    }
    checkIfOk():boolean
    {
        this.errMsg = "";
        this.infoMsg = "";
        this.ok=false;
        let packageCounts: number[] = [];
        for (let i = 0; i < this.packages.length; i++)
        {
            packageCounts.push(0);
        }
        for (let i = 0; i < this.approvals.length; i++)
        {
            if (this.approvals[i])
            {
                let pack = this.applications[i].package;
                packageCounts[pack]++;
            }
        }
        for (let i = 0; i < packageCounts.length; i++)
        {
            if (packageCounts[i] > this.fairj.packages.Packages[i].MaxCompanies)
            {
                this.errMsg = "Too many companies approved for package " + this.fairj.packages.Packages[i].Title;
                return;
            }
        }
        for (let i = 0; i < this.approvals.length; i++)
        {
            let application = this.applications[i];
            let pack = this.fairj.packages.Packages[application.package];
            if (this.approvals[i])
            {
                this.addToEvents("Lesson - "+application.companyName, pack.NoLessons);
                this.addToEvents("Presentation - "+application.companyName, pack.NoPresentation);
                this.addToEvents("Workshop - "+application.companyName, pack.NoWorkchops);
            }
            else
            {
                this.removeFromEvents("Lesson - " + application.companyName);
                this.removeFromEvents("Presentation - " + application.companyName);
                this.removeFromEvents("Workshop - " + application.companyName);
            }
        }
        this.ok=true;
    }
    async done()
    {
        if(!this.ok)
        {
            return;
        }
        this.errMsg = "";
        this.infoMsg = "";
        window.scrollTo(0,0);
        if(this.approvals.findIndex(x=>x))
        {
            this.errMsg="You did not approve any companies";
            return;
        }
        this.getManagedEvents().forEach(x=>{
            if(!x.date)
            {
                this.errMsg="Date not entered for "+x.description;
                return;
            }
            if(!x.time)
            {
                this.errMsg="Time not entered for "+x.description;
                return;
            }
            let minDate=new Date(this.fairj.Fairs[0].StartDate+" "+this.fairj.Fairs[0].StartTime);
            let maxDate=new Date(this.fairj.Fairs[0].EndDate+" "+this.fairj.Fairs[0].EndTime);

            let date=new Date(x.date+" "+x.time);
            if(date<minDate)
            {
                this.errMsg=x.description+" cannot be scheduled before the fair";
                return;
            }
            if(date>maxDate)
            {
                this.errMsg=x.description+" cannot be scheduled after the fair";
                return;
            }
        });
        if(this.errMsg)
        {
            return;
        }
        for(let i=0;i<this.approvals.length;i++)
        {
            if(this.approvals[i]) this.applications[i].status="Accepted";
            else this.applications[i].status="Rejected";
        }
        let oldEvents=this.fairj.CompanyEvents;
        this.fairj.CompanyEvents=this.getManagedEvents();
        let response = await this.adminService.manageFair(this.fairj, this.applications);
        this.fairj.CompanyEvents=oldEvents;
        if(response="OK")
        {
            this.infoMsg="Fair updated successfully";
        }
        else
        {
            this.errMsg=response;
        }
    }

}
