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
    Deadline?:String;
    StartTime?:String;
    EndTime?:String;
    Place?:String;
    About?:String;
    static validate(fair:Fair):String
    {
        if(!fair.Fair) return "Fair name is required";
        if(!fair.StartDate) return "Start date is required";
        if(!fair.EndDate) return "End date is required";
        if(!fair.StartTime) return "Start time is required";
        if(!fair.EndTime) return "End time is required";
        if(!fair.Place) return "Place is required";
        if(!fair.About) return "Details are required";
        if(!fair.Deadline) return "Application deadline is required";
        let deadline=new Date(fair.Deadline.toString());
        let now=new Date();
        if(deadline<=now)
        {
            return "Application deadline cannot be in the past";
        }
        if(fair.StartDate<=fair.Deadline)
        {
            return "Start date must be after application deadline";
        }
        if(fair.StartDate>fair.EndDate || (fair.StartDate==fair.EndDate && fair.StartDate>=fair.EndTime))
        {
            return "Start date cannot be greater than end date";
        }
        return "OK";
    }
}
export class Location1
{
    Place?:String;
    Location:Location2[];
    static validate(l1:Location1):String
    {
        if(!l1.Place) return "Place name is required";
        if(l1.Location!=null && l1.Location.length==0)
        {
            return "Enter at least one location";
        }
        if(!l1.Location) return "FAIL";
        for(let i=0;i<l1.Location.length;i++)
        {
            if(!l1.Location[i]) return "FAIL";
            if(!l1.Location[i].Name) return "Location name is required";
        }
        return "OK";
    }
}
export class Location2{
    Name?:String;
}
export class FairEvent
{
    time?:String;
    date?:String;
    description?:String;
    location?:String;
    static validate(e:FairEvent):String
    {
        if(!e.time) return "Event time is required";
        if(!e.date) return "Event date is required";
        if(!e.description) return "Event description is required";
        if(!e.location) return "Event location is required";
        return "OK";
    }
}
export class FairJSON
{
    logo?:File;
    Fairs:Fair[];
    Events?:FairEvent[];
    Locations:Location1[];
    packages?:PackagesJSON;
    _id?:String;
    static validate(json:FairJSON):String
    {
        if(!json.Fairs || !json.Locations) return "FAIL";
        for(let i=0;i<json.Fairs.length;i++)
        {
            if(Fair.validate(json.Fairs[i])!="OK")
            {
                return Fair.validate(json.Fairs[i]);
            }
        }
        for(let i=0;i<json.Locations.length;i++)
        {
            if(Location1.validate(json.Locations[i])!="OK") 
            {
                return Location1.validate(json.Locations[i])
            }
        }
        return "OK";
    }
    static validateLogo(jsn:FairJSON):String
    {
        if(jsn.logo==null) return "Logo is required";
        if(jsn.logo.mimeType.indexOf("image/")!=0) return "Logo must be an image";
        return "OK";
    }
    static validateEvents(jsn: FairJSON):String
    {
        if(jsn.Events==null) return "FAIL";
        let minDate=new Date(jsn.Fairs[0].StartDate+" "+jsn.Fairs[0].StartTime);
        let maxDate=new Date(jsn.Fairs[0].EndDate+" "+jsn.Fairs[0].EndTime);
        let err:String="OK";
        jsn.Events.forEach(event=>{
            if(FairEvent.validate(event)!="OK")
            {
                err=FairEvent.validate(event);
                return;
            }
            let date=new Date(event.date+" "+event.time)
            if(date<minDate)
            {
                err="Event can't happen before the fair";
            }
            if(date>maxDate)
            {
                err="Event can't happen after the fair";
            }
        });
        return err;
    }
}
export class TmpContent
{
    value:String;
}
export class Package
{
    Title?:String;
    Content?:String[];
    tmpContent?:TmpContent[];
    VideoPromotion?:number;
    NoLessons?:number;
    NoWorkchops?:number;
    NoPresentation?:number;
    Price?:number;
    MaxCompanies?:number;
    static validate(p:Package):String
    {
        if(!p.Title) return "Package title is required";
        if(p.VideoPromotion==null) return "Video promotion length is required";
        if(p.NoLessons==null) return "Video promotion length is required";
        if(p.NoWorkchops==null) return "Video promotion length is required";
        if(p.NoPresentation==null) return "Video promotion length is required";
        if(p.Price==null || p.Price<=0) return "Package price must be a positive number";
        if(p.MaxCompanies==null || p.MaxCompanies<=0) "Company limit must be a positive number";
        let okContent:String[]=[];
        p.Content.forEach(x=>{
            if(x) okContent.push(x);
        });
        p.Content=okContent;
        return "OK";
    }
}
export class Addition
{
    Title?:String;
    Price?:number;
}
export class PackagesJSON
{
    Packages:Package[];
    Additional:Addition[];
    static validate(p:PackagesJSON):String
    {
        if(p.Additional==null) return "FAIL";
        let msg:String="OK";
        p.Additional.forEach(x=>{
            if(!x.Title)
            {
                msg="Addition title is required";
            }
            if(x.Price==null)
            {
                msg="Addition price is required";
            }
            if(x.Price<=0)
            {
                msg="Addition price must be positive";
            }
        });
        if(msg!="OK") return msg;
        if(p.Packages==null) return "FAIL";
        if(p.Packages.length==0) return "Enter at least one package";
        p.Packages.forEach(x=>{
            if(Package.validate(x)!="OK")
            {
                msg=Package.validate(x);
            }
        });
        return msg;        
    }
}