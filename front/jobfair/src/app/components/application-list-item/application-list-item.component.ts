import { Component, OnInit, Input } from '@angular/core';
import { JobApplication } from 'src/app/misc/models';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-application-list-item',
    templateUrl: './application-list-item.component.html',
    styleUrls: ['./application-list-item.component.css']
})
export class ApplicationListItemComponent implements OnInit
{
    @Input() application: JobApplication;
    constructor(private userService:UserService) { }
    canRate():boolean
    {
        if(!this.application.timestamp) return false;
        let timestamp=new Date(this.application.timestamp.toString());
        let now=new Date();
        timestamp.setMonth(timestamp.getMonth()+1);
        if(timestamp>now)
        {
            return false;
        }
        else
        {
            return true;
        }
    }
    ngOnInit()
    {
    }
    async rate(r:number)
    {
        await this.userService.rateApplication(this.application._id, r);
    }
}
