import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, LoadingController, PopoverController } from 'ionic-angular';
import { ProtectedPage } from '../protected-page/protected-page';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';
import { OrdersService } from '../../providers/orders-service';
import { OrderModel } from '../../models/order.model';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage extends ProtectedPage {

  public orders: any;

  private onlyNotAssigned: boolean;

  public filter: any;

  public customTitle: string;

  public loading: any;

  public dataLoaded: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public loadingCtr: LoadingController,
    public popoverCtrl: PopoverController,
    public storage: Storage,
    public authService: AuthService,
    public ordersService: OrdersService) {

    super(navCtrl, navParams, storage, authService);

    this.dataLoaded = false;

    this.onlyNotAssigned = navParams.get('onlyNotAssigned');

    this.customTitle = navParams.get('pageTitle');

    this.filter = 'all';

    this.filterOrders(this.filter);

    //this.loadOrders();
  }

  /*loadOrders() {
    this.ordersService.getAll(this.onlyNotAssigned).then((orders) => {
      this.orders = orders;
      this.dataLoaded = true;
    });
  }*/

  filterOrders(status: any) {
    // Reset items back to all of the items
    return this.ordersService.getAll(this.onlyNotAssigned).then(orders => {
      this.filter = status;
      this.orders = orders;
      if (status == 'processing') {
        var valid_statuses = ["7","6","5","1"];
        this.orders = orders.filter((item) => {
          this.dataLoaded = true;
          return (valid_statuses.indexOf(item.estado) > -1);
        });
      } else if (status == 'completed') {
        var valid_status = ["2"];
        this.orders = orders.filter((item) => {
          this.dataLoaded = true;
          return (valid_status.indexOf(item.estado) > -1);
        });
      } else {
        this.dataLoaded = true;
        return this.orders;
      }
    });
  }

  filtro() {
    if (!this.filter || this.filter == 'all') {
      return 'Todos';
    } else if (this.filter == 'processing') {
      return 'En Proceso';
    } else {
      return 'Completados';
    }
  }

  presentFilter(myEvent) {
    let popover = this.popoverCtrl.create('OrdersFilterPage', { filter: this.filter });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data => {
      if (data && data.filter) {
        this.filterOrders(data.filter);
        console.log("filtro cambiado", data.filter);
      }
    });
  }

  ionViewWillEnter() {
    this.filterOrders(this.filter);
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
    this.navCtrl.push('OrderInfoPage', { order: order });
  }
}
