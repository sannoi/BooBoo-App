import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, LoadingController } from 'ionic-angular';
import {ProtectedPage} from '../protected-page/protected-page';
import {Storage} from '@ionic/storage';
import {AuthService} from '../../providers/auth-service';
import {OrdersService} from '../../providers/orders-service';
import {OrderModel} from '../../models/order.model';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage extends ProtectedPage {

    public orders: any;

    private onlyNotAssigned: boolean;

    public customTitle: string;

	public loading: any;

  public dataLoaded: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
	public loadingCtr: LoadingController,
    public storage: Storage,
	public authService: AuthService,
    public ordersService: OrdersService) {

      super(navCtrl, navParams, storage, authService);

      this.dataLoaded = false;

      this.onlyNotAssigned = navParams.get('onlyNotAssigned');

      this.customTitle = navParams.get('pageTitle');

      this.loadOrders();
  }

  loadOrders() {
    /*this.loading = this.loadingCtr.create({content: "Cargando pedidos..."});

	  this.loading.present().then(() => {*/
		  this.ordersService.getAll(this.onlyNotAssigned).then((orders) => {
			this.orders = orders;
			//this.loading.dismiss();
      this.dataLoaded = true;
		  });
	  //});
  }

  ionViewWillEnter() {
    this.loadOrders();
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }

  numOrders() {
	  return this.orders.length;
  }

  orderInfo(order: OrderModel) {
    this.navCtrl.push('OrderInfoPage', {order: order});
  }
}
