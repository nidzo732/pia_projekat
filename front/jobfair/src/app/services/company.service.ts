import { Injectable } from '@angular/core';
import { CompanyInfo, User, Offer, JobApplication, File } from '../misc/models';
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
}
