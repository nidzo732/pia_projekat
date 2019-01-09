import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Config } from '../misc/config';
import { FairJSON } from '../misc/models';

const siteUrl = Config.baseServerUrl;
const getFairsUrl = siteUrl + "/fairs/fairs";
const getFairUrl = siteUrl + "/fairs/fair";
const fairPictureUrl = siteUrl + "/fairs/fairpicture";

@Injectable({
    providedIn: 'root'
})
export class FairsService
{

    constructor(private httpService: HttpService) { }

    async getFairs(): Promise<FairJSON[]>
    {
        return (await this.httpService.doGetForObject(getFairsUrl)).payload;
    }

    async getFair(id: String): Promise<FairJSON>
    {
        return (await this.httpService.doGetForObject(getFairUrl + "/" + id)).payload;
    }
    getPictureUrl(id: String): String
    {
        return fairPictureUrl+"/"+id;
    }
}
