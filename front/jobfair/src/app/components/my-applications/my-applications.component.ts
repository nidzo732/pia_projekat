import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { JobApplication } from 'src/app/misc/models';

@Component({
    selector: 'app-my-applications',
    templateUrl: './my-applications.component.html',
    styleUrls: ['./my-applications.component.css']
})
export class MyApplicationsComponent implements OnInit
{
    loading:boolean=true;
    applications:JobApplication[]=[];
    constructor(private userService: UserService) { }

    async ngOnInit()
    {
        this.applications = await this.userService.getMyApplications();
        this.loading=false;
    }

}
