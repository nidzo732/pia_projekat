import { Injectable } from '@angular/core';
import { CompanyInfo, User, Offer, JobApplication, File, FairApplication } from '../misc/models';
import { stringify } from '@angular/core/src/util';
import { HttpService } from './http.service';
import { Config } from '../misc/config';

const siteUrl = Config.baseServerUrl;
const companySearchUrl = siteUrl + "/company/search";
const getCompanyUrl = siteUrl + "/company/details";
const postNewOfferUrl = siteUrl + "/company/newoffer";
const searchOffersUrl = siteUrl + "/company/offers";
const getOfferUrl = siteUrl + "/company/offer";
const getApplicationsUrl = siteUrl + "/company/applications";
const getApplicationUrl = siteUrl + "/company/application";
const getCoverLetterUrl = siteUrl + "/company/coverletter";
const getApplicantInfoUrl = siteUrl+"/company/applicantinfo";
const applicationStatusUrl=siteUrl+"/company/applicationstatus";
const detailSearchOffersUrl=siteUrl+"/company/searchoffers";
const scoresUrl=siteUrl+"/company/scores";
const getFairApplicationUrl=siteUrl+"/company/getfairapplication";
const applyToFairUrl=siteUrl+"/company/fairapply";

@Injectable({
    providedIn: 'root'
})
export class CompanyService
{
    constructor(private httpService: HttpService) { }
    async getCompany(name: String): Promise<CompanyInfo>
    {
        let url = getCompanyUrl + "/" + name;
        let response = await this.httpService.doGetForObject(url);
        let company = response.payload;
        company.companyInfo.username = company.username;
        return company.companyInfo;
    }
    async searchCompanies(name: String, city: String, areas: String[]): Promise<CompanyInfo[]>
    {
        if (!name) name = " ";
        if (!city) city = " ";
        let area = " ";
        if (areas && areas.length > 0)
        {
            area = "(" + areas.join(")|(") + ")";
        }
        name = encodeURIComponent(name.toString());
        city = encodeURIComponent(city.toString())
        area = encodeURIComponent(area.toString());
        let url = companySearchUrl + "/" + name + "/" + city + "/" + area;
        let response = await this.httpService.doGetForObject(url);
        let companyUsers: User[] = response.payload;
        let companies: CompanyInfo[] = [];
        companyUsers.forEach(x => { x.companyInfo.username = x.username; companies.push(x.companyInfo); });
        return companies;
    }
    async createOffer(offer: Offer): Promise<String>
    {
        let response = this.httpService.doPostForString(postNewOfferUrl, offer);
        return response;
    }
    async searchOffers(company: String): Promise<Offer[]>
    {
        let response = await this.httpService.doGetForObject(searchOffersUrl + "/" + company);
        return response.payload;
    }

    async getOffer(id: String): Promise<Offer>
    {
        let response = await this.httpService.doGetForObject(getOfferUrl + "/" + id);
        return response.payload;
    }
    async getApplications(offerId:String):Promise<JobApplication[]>
    {
        let response=await this.httpService.doPostForObject(getApplicationsUrl, {offerId:offerId});
        return response.payload;
    }
    async getApplication(id:String):Promise<JobApplication>
    {
        let response=await this.httpService.doPostForObject(getApplicationUrl, {id:id});
        return response.payload;
    }
    async getCoverLetter(id:String):Promise<File>
    {
        let response=await this.httpService.doPostForObject(getCoverLetterUrl, {id:id});
        return response.payload;
    }
    async getApplicantInfo(id:String):Promise<User>
    {
        let response=await this.httpService.doPostForObject(getApplicantInfoUrl, {id:id});
        return response.payload;
    }
    async postApplicationStatus(id:String, accepted:boolean):Promise<String>{
        let response=await this.httpService.doPostForString(applicationStatusUrl, {id:id, accepted:accepted});
        return response;
    }
    async detailedSearchOffers(companyName:String, jobName:String, type:String):Promise<Offer[]>
    {
        if(!companyName) companyName=" ";
        if(!jobName) jobName=" ";
        if(!type) type=" ";
        companyName=encodeURIComponent(companyName.toString());
        jobName=encodeURIComponent(jobName.toString());
        type=encodeURIComponent(type.toString());
        let url = detailSearchOffersUrl + "/" + companyName + "/" + jobName + "/" + type;
        let response=await this.httpService.doGetForObject(url);
        return response.payload;
    }
    async getScores(offerId:String):Promise<JobApplication[]>
    {
        let response = await this.httpService.doGetForObject(scoresUrl+"/"+offerId);
        return response.payload;
    }
    
    async postFairApplication(fa:FairApplication):Promise<String>
    {
        return await this.httpService.doPostForString(applyToFairUrl, fa);        
    }

    async getFairApplication(fair:String):Promise<FairApplication>
    {
        let response = await this.httpService.doPostForObject(getFairApplicationUrl, {id:fair});
        return response.payload;
    }
}
