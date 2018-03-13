import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'

@IonicPage()
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {
  information: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http) {
    let localData = http.get('assets/json/faq.json').map(res => res.json().items);
    localData.subscribe(data => {
      this.information = data;
    });
  }

  toggleSection(i) {
    this.information[i].open = !this.information[i].open;
  }

  toggleItem(i, j) {
    this.information[i].children[j].open = !this.information[i].children[j].open;
  }

}
