import { Component, OnInit } from '@angular/core';
import { CV } from 'src/app/misc/models';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-cv-entry',
  templateUrl: './cv-entry.component.html',
  styleUrls: ['./cv-entry.component.css']
})
export class CvEntryComponent implements OnInit {
  cv:CV={
    education:[{}],
    experience:[{}],
    languages:[],
    motherTongue:"",
    skills:[],
    type:CV.applicationTypes[0]
  }
  applicationTypes:String[]=CV.applicationTypes;
  errMsg:String;
  infoMsg:String;
  loading:boolean=false;
  constructor(private userService:UserService) { }

  async ngOnInit() {
    let user=this.userService.currentUser();
    console.log(user.humanInfo.cv);
    if(user.humanInfo.cv!=null) this.cv=user.humanInfo.cv;
    else this.infoMsg="You must enter your CV first before using all capabilities of this website";
  }
  addEducation(){
    this.cv.education.push({});
  }
  deleteEducation(education:any){
    this.cv.education.splice(this.cv.education.indexOf(education),1);
  }
  addExperience(){
    this.cv.experience.push({});
  }
  addLanguage(){
    this.cv.languages.push({});
  }
  addSkill(){
    this.cv.skills.push({});
  }
  deleteExperience(experience:any){
    this.cv.experience.splice(this.cv.experience.indexOf(experience),1);
  }
  deleteLanguage(language:any){
    this.cv.languages.splice(this.cv.languages.indexOf(language),1);
  }
  deleteSkill(skill:any){
    this.cv.skills.splice(this.cv.skills.indexOf(skill),1);
  }
  async enterCV(){
    this.errMsg="";
    this.infoMsg="";
    let valid=true;
    this.cv.education.forEach((x)=>{
      if(x.from>x.to)
      {
        this.errMsg="From date can not be greater than to date";
        valid=false;
      }
    });
    this.cv.experience.forEach((x)=>{
      if(x.from>x.to)
      {
        this.errMsg="From date can not be greater than to date";
        valid=false;
      }
    });
    window.scrollTo(0,0);
    if(valid){
      this.loading=true;
      let response = await this.userService.enterCV(this.cv);
      this.loading=false;
      if(response=="OK") this.infoMsg="CV updated";
      else this.errMsg=response;
    }
  }
}
