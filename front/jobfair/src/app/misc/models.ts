export class HumanInfo{
    firstName?:String;
    lastName?:String;
    email?:String;
    phone?:String;
    studyYear?:number;
    graduated?:boolean;
    cvCreated?:Date;
    cv?:CV;
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
    picture?:String;
    static areas:String[]=[ "IT", "Telecom", "Power systems", "Civil egineering", "Architecture", "Mechanical engineering" ];

}
export class CV
{
    static applicationTypes:String[]=["Job", "Internship"];
    type:String;
    experiences:{description?:String, from?:Date, to?:Date}[];
    education:{description?:String, from?:Date, to?:Date}[];
    skills:String[];
    motherTongue:String;
    languages:String[];
}
export class User
{
    username:String;
    password?:String="";
    kind?:String;
    humanInfo?:HumanInfo;
    companyInfo?:CompanyInfo;
    token?:String;
    picture?:String;
    pictureUrl?:String;
}