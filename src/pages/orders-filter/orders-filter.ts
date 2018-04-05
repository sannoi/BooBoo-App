import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ProtectedPage } from '../protected-page/protected-page';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';

@IonicPage()
@Component({
  selector: 'page-orders-filter',
  templateUrl: 'orders-filter.html',
})
export class OrdersFilterPage extends ProtectedPage {

  filter: any;
  initial_change: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    public storage: Storage,
    public authService: AuthService) {
      super(navCtrl, navParams, storage, authService);
      if (navParams.get('filter')) {
        this.filter = navParams.get('filter');
      } else {
        this.filter = 'all';
      }
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
