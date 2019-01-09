import { Component, OnInit } from '@angular/core';
import { FileLoader } from 'src/app/misc/fileLoader';
import { FairJSON, Location1, Location2, Fair, FairEvent, PackagesJSON, Package, Addition } from 'src/app/misc/models';
import { AdminService } from 'src/app/services/admin-service';
import { ActivatedRoute } from '@angular/router';


function parseDate(date:String):String
{
    let split=date.split("/");
    let isoDate=split[2]+"-"+split[1]+"-"+split[0];
    let parsed=new Date(isoDate);
    if(parsed.getDate())
    {
        return isoDate;
    }
    else
    {
        throw "Bad date";
    }
}
function parseTime(time:String):String
{
    let full="2015-01-01 "+time;
    let parsed=new Date(full);
    if(parsed.getHours()) return time;
    else
    {
        throw "Bad time";
    }
}

function reviver(key, value){
    if(key=="StartDate" || key=="EndDate")
    {
        return parseDate(value);
    }
    else if(key=="StartTime" || key=="EndTime")
    {
        return parseTime(value);
    }
    else if(key=="MaxCompanies" && value=="-")
    {
        return Number.MAX_SAFE_INTEGER;
    }
    else
    {
        return value;
    }
};

@Component({
    selector: 'app-fair-entry',
    templateUrl: './fair-entry.component.html',
    styleUrls: ['./fair-entry.component.css']
})
export class FairEntryComponent implements OnInit
{
    errMsg:String;
    infoMsg:String;
    loading:boolean=false;
    step:number=0;
    allReadonly:boolean=false;
    logoSrc:String;
    fair:FairJSON={
        Locations:[
            {
                Location:[
                    {
                        
                    }
                ]
            }
        ],
        Fairs:[
            {

            }
        ],
        Events:[
            {

            }
        ]
    };
    packages:PackagesJSON={
        Additional:[
            {
                
            }
        ],
        Packages:[
            {

            }
        ]
    };
    constructor(private adminService:AdminService, private route:ActivatedRoute) { }

    async ngOnInit()
    {
        if(this.route.snapshot.paramMap.get("id"))
        {
            this.loading=true;
            let id=this.route.snapshot.paramMap.get("id");
            let fair=await this.adminService.getFair(id);
            this.loading=false;
            this.fair=fair;
            this.packages=fair.packages;
            this.loadTmpContent();
            this.loadLogo();
        }
    }
    async logoChange(event: any)
    {        
        if (event.target.files && event.target.files[0])
        {
            let filePath = event.target.files[0];
            let loadedFile = await FileLoader.loadFile(filePath);
            this.fair.logo={
                content64:loadedFile.content64,
                mimeType:loadedFile.mime,
                name:loadedFile.name
            };
        }
        else
        {
            this.fair.logo=null;
        }
        this.loadLogo();
    }
    loadLogo()
    {
        if(this.fair.logo==null)
        {
            this.logoSrc="";
        }
        else
        {
            this.logoSrc="data:"+this.fair.logo.mimeType+";base64,"+this.fair.logo.content64;
        }
    }
    async json1Change(event:any)
    {
        this.errMsg="";
        this.infoMsg="";
        if (event.target.files && event.target.files[0])
        {
            let filePath = event.target.files[0];
            let loadedFile = await FileLoader.loadFile(filePath);
            let content=atob(loadedFile.content64.toString());
            try
            {
                var loaded:FairJSON=JSON.parse(content, reviver);
            }
            catch
            {
                this.errMsg="JSON file is invalid";
                return;
            }
            
            let validationResult=FairJSON.validate(loaded);
            if(validationResult=="FAIL")
            {
                this.errMsg="JSON file is invalid";
                return;
            }
            if(loaded.Fairs.length>1)
            {
                loaded.Fairs=[loaded.Fairs[0]];
            }
            if(loaded.Locations.length>0)
            {
                loaded.Locations=[loaded.Locations[0]];
            }
            this.fair=loaded;
            this.fair.Events=[{}];
        }
    }
    loadTmpContent()
    {
        this.packages.Packages.forEach(x=>{
            if(x.Content!=null)
            {
                x.tmpContent=[];
                x.Content.forEach(y=>{
                    x.tmpContent.push({value:y});
                });
            }
        })
    }
    storeTmpContent()
    {
        this.packages.Packages.forEach(x=>{
            if(x.tmpContent!=null)
            {
                x.Content=[];
                x.tmpContent.forEach(y=>{
                    x.Content.push(y.value);
                });
            }
        });
    }
    async json2Change(event:any)
    {
        this.errMsg="";
        this.infoMsg="";
        if (event.target.files && event.target.files[0])
        {
            let filePath = event.target.files[0];
            let loadedFile = await FileLoader.loadFile(filePath);
            let content=atob(loadedFile.content64.toString());
            try
            {
                var loaded:PackagesJSON=JSON.parse(content, reviver);
            }
            catch
            {
                this.errMsg="JSON file is invalid";
                return;
            }
            
            let validationResult=PackagesJSON.validate(loaded);
            if(validationResult=="FAIL")
            {
                this.errMsg="JSON file is invalid";
                return;
            }
            if(loaded.Packages==null || loaded.Packages.length==0)
            {
                loaded.Packages=[{}];
            }
            if(loaded.Additional==null || loaded.Additional.length==0)
            {
                loaded.Additional=[{}];
            }
            this.packages=loaded;
            this.loadTmpContent();
        }
    }
    addNameToLocation(location:Location1)
    {
        location.Location.push({});
    }
    removeLocation(location:Location2)
    {
        this.fair.Locations[0].Location.splice(this.fair.Locations[0].Location.indexOf(location),1);
    }
    goto1()
    {
        this.errMsg="";
        this.infoMsg="";
        window.scrollTo(0,0);
        if(FairJSON.validate(this.fair)!="OK")
        {
            this.errMsg=FairJSON.validate(this.fair);
        }
        else
        {
            this.step=1;
        }
    }
    removeEvent(e:FairEvent)
    {
        this.fair.Events.splice(this.fair.Events.indexOf(e), 1);
    }
    addEvent()
    {
        this.fair.Events.push({});
    }
    back()
    {
        this.step--;
        this.allReadonly=false;
    }
    goto2()
    {
        this.errMsg="";
        this.infoMsg="";
        window.scrollTo(0,0);
        if(FairJSON.validateLogo(this.fair)!="OK")
        {
            this.errMsg=FairJSON.validateLogo(this.fair);
            return;
        }
        if(FairJSON.validateEvents(this.fair)!="OK")
        {
            this.errMsg=FairJSON.validateEvents(this.fair);
            return;
        }
        this.step=2;
    }
    removePackage(p:Package)
    {
        this.packages.Packages.splice(this.packages.Packages.indexOf(p),1);
    }
    addPackage()
    {
        this.packages.Packages.push({});
    }
    deleteContent(p:Package, index:number)
    {
        p.tmpContent.splice(index, 1);
    }
    addContent(p:Package)
    {
        if(p.tmpContent==null) p.tmpContent=[];
        p.tmpContent.push({value:""});
    }
    goto3()
    {
        window.scrollTo(0,0);
        this.errMsg="";
        this.infoMsg="";
        this.storeTmpContent();
        if(PackagesJSON.validate(this.packages)!="OK")
        {
            this.errMsg=PackagesJSON.validate(this.packages);
            return;
        }
        this.allReadonly=true;
        this.step=3;
    }
    removeAddition(addition:Addition)
    {
        this.packages.Additional.splice(this.packages.Additional.indexOf(addition),1);
    }
    async doSubmit()
    {
        this.fair.packages=this.packages;
        this.adminService.postFair(this.fair);
    }
}
