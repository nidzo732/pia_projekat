import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

const emptyStar:String="☆";
const fullStar:String="★";
@Component({
    selector: 'app-rating-stars',
    templateUrl: './rating-stars.component.html',
    styleUrls: ['./rating-stars.component.css']
})
export class RatingStarsComponent implements OnInit
{
    @Input() rating:number;
    @Output() onRate: EventEmitter<any> = new EventEmitter();
    stars:String="";
    displayNumber:number;
    constructor() { 
    }

    ngOnInit()
    {
        if(!this.rating) this.rating=0;
        this.displayNumber=this.rating;
        this.draw();
    }
    draw()
    {
        this.stars="";
        for(let i=0;i<10;i++)
        {
            if(i<this.displayNumber) this.stars+=fullStar.toString();
            else this.stars+=emptyStar.toString();
        }
    }
    hover(s:number)
    {
        this.displayNumber=s;
        this.draw();
    }
    unhover()
    {
        this.displayNumber=this.rating;
        this.draw();
    }
    rate(s:number)
    {
        this.rating=s;
        this.onRate.emit(this.rating);
    }

}
