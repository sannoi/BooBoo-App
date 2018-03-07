import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-orders-filter',
  templateUrl: 'orders-filter.html',
})
export class OrdersFilterPage {

  filter: any;
  initial_change: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    if (navParams.get('filter')) {
      this.filter = navParams.get('filter');
    } else {
      this.filter = 'all';
    }
    console.log(navParams);
  }

  changeFilter() {
    if (this.initial_change) {
      let data = { filter: this.filter };
      this.viewCtrl.dismiss(data);
    } else {
      this.initial_change = true;
    }
  }

  ionViewDidLoad() {  }

}
