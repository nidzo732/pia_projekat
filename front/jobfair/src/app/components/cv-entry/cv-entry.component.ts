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
  constructor(private userService:UserService) { }

  async ngOnInit() {
    let user=await this.userService.currentUser();
    if(user.humanInfo.cv!=null) this.cv=user.humanInfo.cv;
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
  deleteExperience(experience:any){
    this.cv.experience.splice(this.cv.experience.indexOf(experience),1);
    this.cv
  }
  deleteLanguage(language:any){
    this.cv.languages.splice(this.cv.languages.indexOf(language),1);
  }
  deleteSkill(skill:any){
    this.cv.skills.splice(this.cv.skills.indexOf(skill),1);
  }
  async enterCV(){
    await this.userService.enterCV(this.cv);
    this.infoMsg="Cv updated";
    window.scrollTo(0,0);
  }
}
