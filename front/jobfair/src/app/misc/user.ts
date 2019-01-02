export class HumanInfo{
    firstName?:String;
    lastName?:String;
    email?:String;
    phone?:String;
    studyYear?:number;
    graduated?:boolean;
}
export class CompanyInfo{
    name?:String;
    city?:String;
    director?:String;
    pib?:String;
    employeeCount?:number;
    email?:String;
    site?:String;
    area?:String;
    specialty?:String;
    static areas:String[]=[ "IT", "Telecom", "Power systems", "Civil egineering", "Architecture", "Mechanical engineering" ];

}
export class User
{
    username:String;
    password?:String="";
    kind?:String;
    humanInfo?:HumanInfo;
    companyInfo?:CompanyInfo;
    token?:String;
}