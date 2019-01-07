import { Component, OnInit } from '@angular/core';
import { JobApplication } from 'src/app/misc/models';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';
import { saveAs } from "file-saver"
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-application-info',
    templateUrl: './application-info.component.html',
    styleUrls: ['./application-info.component.css']
})
export class ApplicationInfoComponent implements OnInit
{
    loading: boolean = true;
    application: JobApplication = {

    };
    constructor(private route: ActivatedRoute,
        private companyService: CompanyService,
        public userService: UserService) { }

    async ngOnInit()
    {
        let appId = this.route.snapshot.paramMap.get("id");
        this.application = await this.companyService.getApplication(appId);
        this.loading = false;
    }
    async downloadCoverLetter()
    {
        let file = await this.companyService.getCoverLetter(this.application._id);
        let byteString = atob(file.content64.toString());
        var byteNumbers = new Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            byteNumbers[i] = byteString.charCodeAt(i);
        }
        let content=new Uint8Array(byteNumbers);

        let blob = new Blob([content], {
            type: file.mimeType.toString()
        });
        saveAs(blob, file.name);
    }
}
