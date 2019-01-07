import { Component, OnInit, Input } from '@angular/core';
import { JobApplication } from 'src/app/misc/models';

@Component({
    selector: 'app-application-list-item',
    templateUrl: './application-list-item.component.html',
    styleUrls: ['./application-list-item.component.css']
})
export class ApplicationListItemComponent implements OnInit
{
    @Input() application: JobApplication;
    constructor() { }

    ngOnInit()
    {
    }
}
