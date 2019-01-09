import { Component, OnInit } from '@angular/core';
import { FairsService } from 'src/app/services/fairs.service';
import { ActivatedRoute } from '@angular/router';
import { FairJSON, FairApplication, Fair, Package, Addition } from 'src/app/misc/models';
import { UserService } from 'src/app/services/user.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
    selector: 'app-fair-application',
    templateUrl: './fair-application.component.html',
    styleUrls: ['./fair-application.component.css']
})
export class FairApplicationComponent implements OnInit
{
    private fairj: FairJSON;
    private fair: Fair;
    private packages: Package[];
    private additions: Addition[];
    private additionCheck: boolean[];
    private package: Package;
    private price: number;
    errMsg:String;
    infoMsg:String;
    loading: boolean = true;
    application: FairApplication = {
        additions: [],
        company: "",
        fair: "",
        package: 0
    }
    constructor(private fairsService: FairsService,
        private route: ActivatedRoute,
        private userService: UserService,
        private companyService:CompanyService)
    {
        let id = this.route.snapshot.paramMap.get("id");
        this.application.company = this.userService.currentUser().username;
        this.application.fair = id;
    }

    async ngOnInit()
    {
        let id = this.route.snapshot.paramMap.get("id");
        let fair = await this.fairsService.getFair(id);
        let oldApplication = await this.companyService.getFairApplication(id);
        this.fairj =fair;
        this.fair = this.fairj.Fairs[0];
        this.additions = this.fairj.packages.Additional;
        this.packages = this.fairj.packages.Packages;
        if(oldApplication)
        {
            this.application=oldApplication;
        }
        this.additionCheck = [];
        for (let i = 0; i < this.fairj.packages.Additional.length; i++)
        {
            if (this.application.additions.indexOf(i) != -1) this.additionCheck.push(true);
            else this.additionCheck.push(false);
        }
        this.package = this.packages[this.application.package];
        this.recalculatePrice();
        this.loading = false;
    }
    selectPackage()
    {
        this.package = this.packages[this.application.package];
        this.recalculatePrice();
    }
    additionChange()
    {
        this.recalculatePrice();
    }
    recalculatePrice()
    {
        this.price = this.package.Price;
        for (let i = 0; i < this.additions.length; i++)
        {
            if (this.additionCheck[i]) 
            {
                this.price += this.additions[i].Price;
            }
        }
    }
    async apply()
    {
        window.scrollTo(0,0);
        this.errMsg="";
        this.infoMsg="";
        this.loading=true;
        this.application.additions = [];
        for (let i = 0; i < this.additionCheck.length; i++)
        {
            if (this.additionCheck[i]) this.application.additions.push(i);
        }
        let response=await this.companyService.postFairApplication(this.application);
        this.loading=false;
        if(response=="OK")
        {
            this.infoMsg = "You have applied successfully";
        }
        else
        {
            this.errMsg=response;
        }
    }

}
