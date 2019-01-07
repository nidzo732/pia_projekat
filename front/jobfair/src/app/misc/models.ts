export class HumanInfo {
    firstName?: String;
    lastName?: String;
    email?: String;
    phone?: String;
    studyYear?: number;
    graduated?: boolean;
    cvCreated?: Date;
    cv?: CV;
}
export class CompanyInfo {
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
export class File {
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
    static getIcon(file:File): String {
        let split = file.name.split(".");
        let name = "_blank.png";
        if (split.length > 1) {
            let extension = split[split.length - 1];
            let filename=extension+".png";
            if(File.supportedIcons.indexOf(filename)!=-1)
            {
                name=filename;
            }
        }
        return name;
    }
}
export class JobApplication{
    offerId?:String;
    username?:String;
    userLongName?:String;
    companyName?:String;
    status?:String;
    offerDescription?:String;
    coverLetterUpload?:File;
    coverLetter?:String;
}
export class Offer {
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
export class CV {
    static applicationTypes: String[] = ["Job", "Internship"];
    type?: String;
    experience: { description?: String, from?: Date, to?: Date }[];
    education: { description?: String, from?: Date, to?: Date }[];
    skills: { description?: String }[];
    motherTongue?: String;
    languages: { description?: String }[];
}
export class User {
    username: String;
    password?: String = "";
    kind?: String;
    humanInfo?: HumanInfo;
    companyInfo?: CompanyInfo;
    token?: String;
    picture?: String;
    pictureUrl?: String;
}