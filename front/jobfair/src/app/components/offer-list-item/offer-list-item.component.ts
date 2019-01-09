import { Component, OnInit, Input } from '@angular/core';
import { Offer } from 'src/app/misc/models';

@Component({
    selector: 'app-offer-list-item',
    templateUrl: './offer-list-item.component.html',
    styleUrls: ['./offer-list-item.component.css']
})
export class OfferListItemComponent implements OnInit
{
    @Input() offer: Offer;
    constructor() { }

    ngOnInit()
    {
    }

    formatDate(date: String): String
    {
        return (new Date(date.toString())).toLocaleDateString();
    }

}
