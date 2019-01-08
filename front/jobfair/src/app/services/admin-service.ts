import { Injectable } from '@angular/core';
import { Config } from '../misc/config';
import { HttpService } from './http.service';
import { AdminConfig } from '../misc/models';

const siteUrl = Config.baseServerUrl;
const setConfigUrl = siteUrl + "/admin/setconfig";
const getConfigUrl = siteUrl + "/admin/getconfig";
@Injectable({
    providedIn: 'root'
})
export class AdminService
{
    constructor(private httpService:HttpService) { }

    async getAdminConfig():Promise<AdminConfig>
    {
        let response=await this.httpService.doPostForObject(getConfigUrl, {});
        return response.payload;
    }
    async setAdminConfig(cfg:Config):Promise<String>
    {
        let response=await this.httpService.doPostForString(setConfigUrl, {config:cfg});
        return response;
    }
}
