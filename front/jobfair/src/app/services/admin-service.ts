import { Injectable } from '@angular/core';
import { Config } from '../misc/config';
import { HttpService } from './http.service';
import { AdminConfig, FairJSON, FairApplication } from '../misc/models';

const siteUrl = Config.baseServerUrl;
const setConfigUrl = siteUrl + "/admin/setconfig";
const getConfigUrl = siteUrl + "/admin/getconfig";
const postFairUrl=siteUrl + "/admin/postfair";
const getFairUrl=siteUrl + "/admin/getfair";
const getFairApplicationsUrl  = siteUrl+"/admin/getapplications";
const manageFairUrl = siteUrl+"/admin/managefair";

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
    async postFair(fair:FairJSON):Promise<String>
    {
        let response = await this.httpService.doPostForString(postFairUrl, fair);
        return response;
    }
    async getFair(id:String):Promise<FairJSON>
    {
        let response=await this.httpService.doPostForObject(getFairUrl, {id:id});
        return response.payload;
    }
    async getFairApplications(id:String):Promise<FairApplication[]>
    {
        let response=await this.httpService.doPostForObject(getFairApplicationsUrl, {id:id});
        return response.payload;
    }

    async manageFair(fair:FairJSON, applications:FairApplication[])
    {
        let response = await this.httpService.doPostForString(manageFairUrl, {fair:fair, applications:applications});
        return response;
    }
}
