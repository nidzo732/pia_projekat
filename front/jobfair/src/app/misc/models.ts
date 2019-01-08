export class HumanInfo
{
    firstName?: String;
    lastName?: String;
    email?: String;
    phone?: String;
    studyYear?: number;
    graduated?: boolean;
    cv?: CV;
    canFillCV?:boolean;
}
export class CompanyInfo
{
    name?: String;
    city?: String;
    director?: String;
    pib?: String;
    employeeCount?: number;
    email?: String;
    site?: String;
    area?: String;
    specialty?: String;
    username?: String;
    static areas: String[] = ["IT", "Telecom", "Power systems", "Civil egineering", "Architecture", "Mechanical engineering"];

}
export class File
{
    static supportedIcons: String[] = [
        "aac.png",
        "ai.png",
        "aiff.png",
        "avi.png",
        "bmp.png",
        "c.png",
        "cpp.png",
        "css.png",
        "csv.png",
        "dat.png",
        "dmg.png",
        "doc.png",
        "dotx.png",
        "dwg.png",
        "dxf.png",
        "eps.png",
        "exe.png",
        "flv.png",
        "gif.png",
        "h.png",
        "hpp.png",
        "html.png",
        "ics.png",
        "iso.png",
        "java.png",
        "jpg.png",
        "js.png",
        "key.png",
        "less.png",
        "mid.png",
        "mp3.png",
        "mp4.png",
        "mpg.png",
        "odf.png",
        "ods.png",
        "odt.png",
        "otp.png",
        "ots.png",
        "ott.png",
        "pdf.png",
        "php.png",
        "png.png",
        "ppt.png",
        "psd.png",
        "py.png",
        "qt.png",
        "rar.png",
        "rb.png",
        "rtf.png",
        "sass.png",
        "scss.png",
        "sql.png",
        "tga.png",
        "tgz.png",
        "tiff.png",
        "txt.png",
        "wav.png",
        "xls.png",
        "xlsx.png",
        "xml.png",
        "yml.png",
        "zip.png",
        "_blank.png",
        "_page.png"
    ];
    name?: String;
    mimeType?: String;
    content64?: String;
    static getIcon(file: File): String
    {
        let split = file.name.split(".");
        let name = "_blank.png";
        if (split.length > 1)
        {
            let extension = split[split.length - 1];
            let filename = extension + ".png";
            if (File.supportedIcons.indexOf(filename) != -1)
            {
                name = filename;
            }
        }
        return name;
    }
}
export class JobApplication
{
    _id?: String;
    offerId?: String;
    username?: String;
    userLongName?: String;
    companyName?: String;
    status?: String;
    offerDescription?: String;
    coverLetterUpload?: File;
    coverLetter?: String;
    timestamp?:String;
    rating?:number;
}
export class Offer
{
    _id?: String;
    description: String;
    longDescription?: String;
    company: String;
    companyName?: String;
    files?: File[];
    type: String;
    deadline?: Date
    static offerTypes: String[] = ["Job", "Internship"];
}
export class AdminConfig
{
    cvDeadline?:number;
    _id?:String;
}
export class CV
{
    static applicationTypes: String[] = ["Job", "Internship"];
    type?: String;
    experience: { description?: String, from?: Date, to?: Date }[];
    education: { description?: String, from?: Date, to?: Date }[];
    skills: { description?: String }[];
    motherTongue?: String;
    languages: { description?: String }[];
    deadline?:String;
}
export class User
{
    username: String;
    password?: String = "";
    kind?: String;
    humanInfo?: HumanInfo;
    companyInfo?: CompanyInfo;
    token?: String;
    picture?: String;
    pictureUrl?: String;
    admin?: boolean;
}
export class Fair
{
    Fair?:String;
    StartDate?:String;
    EndDate?:String;
    StartTime?:String;
    EndTime?:String;
    Place?:String;
    About?:String;
    static validate(fair:Fair):boolean
    {
        if(!fair.Fair) return false;
        if(!fair.StartDate) return false;
        if(!fair.EndDate) return false;
        if(!fair.StartTime) return false;
        if(!fair.EndTime) return false;
        if(!fair.Place) return false;
        if(!fair.About) return false;
        return true;
    }
}
export class Location1
{
    Place?:String;
    Location:Location2[];
    static validate(l1:Location1):boolean
    {
        if(!l1.Place) return false;
        if(!l1.Location) return false;
        for(let i=0;i<l1.Location.length;i++)
        {
            if(!l1.Location[i]) return false;
            if(!l1.Location[i].Name) return false;
        }
        return true;
    }
}
export class Location2{
    Name?:String;
}
export class FairJSON
{
    Fairs:Fair[];
    Locations:Location1[];
    static validate(json:FairJSON):boolean
    {
        if(!json.Fairs || !json.Locations) return false;
        for(let i=0;i<json.Fairs.length;i++)
        {
            if(!Fair.validate(json.Fairs[i])) return false;
        }
        for(let i=0;i<json.Locations.length;i++)
        {
            if(!Location1.validate(json.Locations[i])) return false;
        }
        return true;
    }
}
export class Package
{
    Title:String;
    Content:String[];
    VideoPromotion:String;
    NoLessons:number;
    NoWorkchops:number;
    NoPresentation:number;
    Price:number;
    MaxCompanies:number;
}
export class Addition
{
    Title:String;
    Price:number;
}
export class PackagesJSON
{
    Packages:Package[];
    Additional:Addition[];
}