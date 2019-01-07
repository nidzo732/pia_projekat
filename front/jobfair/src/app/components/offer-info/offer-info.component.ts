import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from 'src/app/services/company.service';
import { Offer } from 'src/app/misc/models';
import { File } from "../../misc/models";
import { UserService } from 'src/app/services/user.service';
import { Config } from 'src/app/misc/config';

@Component({
  selector: 'app-offer-info',
  templateUrl: './offer-info.component.html',
  styleUrls: ['./offer-info.component.css']
})
export class OfferInfoComponent implements OnInit {
  offer: Offer;
  loading: boolean = true;
  constructor(private route: ActivatedRoute, private companyService: CompanyService, public userService: UserService, private router:Router) { }
  async ngOnInit() {
    let offerId = this.route.snapshot.paramMap.get("id");
    let offer = await this.companyService.getOffer(offerId);
    this.loading = false;
    this.offer = offer;
  }
  formatDate(date: String): String {
    if (date) {
      return (new Date(date.toString())).toDateString();
    }
    else {
      return "";
    }
  }
  getFileIcon(file: File): String {
    console.log(file);
    return File.getIcon(file);
  }
  getFileUrl(file: File): String {
    return Config.baseServerUrl + `/company/offerfile/${this.offer._id}/${this.offer.files.indexOf(file)}`;
  }
  apply() {
    this.router.navigate(["/apply/"+this.offer._id]);
  }

}
