import { Component, OnInit, Input } from '@angular/core';
import { File } from 'src/app/misc/models';

@Component({
    selector: 'app-file-list-item',
    templateUrl: './file-list-item.component.html',
    styleUrls: ['./file-list-item.component.css']
})
export class FileListItemComponent implements OnInit
{
    @Input() file: File;
    constructor() { }

    ngOnInit()
    {
    }
    getFileIcon(): String
    {
        return File.getIcon(this.file);
    }

}
