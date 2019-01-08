import { Component, OnInit } from '@angular/core';
import { FileLoader } from 'src/app/misc/fileLoader';
import { FairJSON } from 'src/app/misc/models';
import { parse } from 'querystring';


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

@Component({
    selector: 'app-fair-entry',
    templateUrl: './fair-entry.component.html',
    styleUrls: ['./fair-entry.component.css']
})
export class FairEntryComponent implements OnInit
{
    step:number=0;
    fairJson:FairJSON={
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
        ]
    };
    constructor() { }

    ngOnInit()
    {
    }
    async json1Change(event:any)
    {
        if (event.target.files && event.target.files[0])
        {
            let filePath = event.target.files[0];
            let loadedFile = await FileLoader.loadFile(filePath);
            let content=atob(loadedFile.content64.toString());
            let loaded:FairJSON=JSON.parse(content, (key, value)=>{
                if(key=="StartDate" || key=="EndDate")
                {
                    return parseDate(value);
                }
                else if(key=="StartTime" || key=="EndTime")
                {
                    return parseTime(value);
                }
                else
                {
                    return value;
                }
            });
            if(FairJSON.validate(loaded))
            {
                console.log("OK");
            }
            else
            {
                console.log("NO");
            }
        }
        else
        {
            
        }
    }

}
