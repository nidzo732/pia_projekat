import { Component, OnInit } from '@angular/core';
import { FairJSON } from 'src/app/misc/models';
import { FairsService } from 'src/app/services/fairs.service';

@Component({
    selector: 'app-fairs',
    templateUrl: './fairs.component.html',
    styleUrls: ['./fairs.component.css']
})
export class FairsComponent implements OnInit
{
    fairs:FairJSON[]=[];
    loading:boolean=true;
    constructor(private fairsService:FairsService) { }

    async ngOnInit()
    {
        this.fairs=await this.fairsService.getFairs();
        this.loading=false;
    }

    getPictureUrl(fair:FairJSON)
    {
        return this.fairsService.getPictureUrl(fair._id);
    }

}
