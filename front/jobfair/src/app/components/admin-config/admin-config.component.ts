import { Component, OnInit } from '@angular/core';
import { AdminConfig } from 'src/app/misc/models';
import { AdminService } from 'src/app/services/admin-service';
import { config } from 'rxjs';

@Component({
    selector: 'app-admin-config',
    templateUrl: './admin-config.component.html',
    styleUrls: ['./admin-config.component.css']
})
export class AdminConfigComponent implements OnInit
{
    errMsg:String;
    infoMsg:String;
    config:AdminConfig={};
    constructor(private adminService:AdminService) { }

    async ngOnInit()
    {
        console.log(this.adminService);
        this.config=await this.adminService.getAdminConfig();
        console.log(this.config);
    }
    async update()
    {
        this.errMsg="";
        this.infoMsg="";
        if(!this.config.cvDeadline || this.config.cvDeadline<=0)
        {
            this.errMsg="Deadline must be a positive number";
            return;
        }
        await this.adminService.setAdminConfig(this.config);
        this.infoMsg="Config updated";
    }

}
