import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CalendarComponentOptions } from 'ion2-calendar';

@IonicPage()
@Component({
  selector: 'page-orders-calendar',
  templateUrl: 'orders-calendar.html',
})
export class OrdersCalendarPage {

  dateRange: { from: string; to: string; };
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range'
  };

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams) {
    if (navParams.get('dates_range')) {
      this.dateRange = navParams.get('dates_range');
    }
  }

  onChange($event) {
    if ($event.from && $event.to) {
      let data = { dates_range: $event };
      this.viewCtrl.dismiss(data);
    }
  }

  ionViewDidLoad() { }

}
