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
    username?:String;
    static areas:String[]=[ "IT", "Telecom", "Power systems", "Civil egineering", "Architecture", "Mechanical engineering" ];

}
export class File
{
    name?:String;
    mimeType?:String;
    content64?:String;
}
export class Offer
{
    _id:String;
    description:String;
    longDescription?:String;
    company:String;
    files?:File[];
    type:String;
    deadline?:Date
    static offerTypes:String[]=["Job", "Internship"];
}
export class CV
{
    static applicationTypes:String[]=["Job", "Internship"];
    type?:String;
    experience:{description?:String, from?:Date, to?:Date}[];
    education:{description?:String, from?:Date, to?:Date}[];
    skills:{description?:String}[];
    motherTongue?:String;
    languages:{description?:String}[];
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