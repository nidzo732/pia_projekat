import { Component, OnInit } from '@angular/core';
import { Offer, File } from 'src/app/misc/models';
import { UserService } from 'src/app/services/user.service';
import { CompanyService } from 'src/app/services/company.service';
import { FileLoader } from 'src/app/misc/fileLoader';
import { load } from '@angular/core/src/render3';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offerentry',
  templateUrl: './offerentry.component.html',
  styleUrls: ['./offerentry.component.css']
})
export class OfferentryComponent implements OnInit {
  errMsg:String;
  infoMsg:String;
  loading:boolean=false;
  offer:Offer={
    company:"",
    description:"",
    files:[],
    longDescription:"",
    type:Offer.offerTypes[0],
  }
  offerTypes:String[]=Offer.offerTypes;

  constructor(private userService:UserService, private companyService:CompanyService, private router:Router) { }

  ngOnInit() {
    let user=this.userService.currentUser();
    this.offer.company=user.companyInfo.name;
  }
  async fileChange(event:any, file:File)
  {
    if(event.target.files && event.target.files[0])
    {
      let filePath=event.target.files[0];
      let loadedFile = await FileLoader.loadFile(filePath);      
      file.content64=loadedFile.content64;
      file.mimeType=loadedFile.mime;
      file.name=loadedFile.name;
    }
    else
    {
      file.content64=null;
      file.mimeType=null;
      file.name=null;
    }
  }
  addFile(){
    this.offer.files.push({})
  }
  async createOffer(){
    window.scrollTo(0,0);
    this.errMsg="";
    this.infoMsg="";
    if((new Date())>new Date(this.offer.deadline))
    {
      this.errMsg="Deadline cannot be in the past";
      return;
    }
    let okFiles:File[]=[];
    this.offer.files.forEach(file=>{
      if(file.name && file.content64 && file.mimeType)
      {
        okFiles.push(file);
      }
    });
    this.offer.files=okFiles;
    this.loading=true;
    let response = await this.companyService.createOffer(this.offer);
    if(response=="OK")
    {
      this.infoMsg="Offer posted successfully";
    }
    else
    {
      this.errMsg=response;
    }
    this.loading=false;
  }
}
