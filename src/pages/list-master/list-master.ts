import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, LoadingController, PopoverController, ModalController } from 'ionic-angular';
import { ProtectedPage } from '../protected-page/protected-page';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';
import { OrdersService } from '../../providers/orders-service';
import { OrderModel } from '../../models/order.model';
import { CalendarModal, CalendarModalOptions, DayConfig, CalendarResult } from "ion2-calendar";

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage extends ProtectedPage {

  public orders: any;

  private onlyNotAssigned: boolean;

  public filter: any;

  public dates_range: any;

  public customTitle: string;

  public loading: any;

  public dataLoaded: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public loadingCtr: LoadingController,
    public modalCtrl: ModalController,
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

  filterOrders(status: any, range?: any) {
    // Reset items back to all of the items
    return this.ordersService.getAll(this.onlyNotAssigned).then(orders => {
      this.filter = status;
      this.orders = orders;
      if (range) {
        this.dates_range = range;
        if (this.dates_range.from && this.dates_range.to) {
          var este = this;
          orders = this.orders = this.orders.filter(function(x){
            var recogida_fecha_exp = x.datos.recogida.recogida_fecha.split('-');
            var fecha_recogida = recogida_fecha_exp[2] + '-' + recogida_fecha_exp[1] + '-' + recogida_fecha_exp[0];
            if (recogida_fecha_exp[0].length == 4) {
              fecha_recogida = recogida_fecha_exp[0] + '-' + recogida_fecha_exp[1] + '-' + recogida_fecha_exp[2];
            }
            var date_rec = new Date(fecha_recogida);
            var date_from = new Date(este.dates_range.from);
            var date_to = new Date(este.dates_range.to);
            console.log('comprobar fecha', date_rec, date_from, date_to);
            return (date_rec >= date_from) && (date_rec <= date_to);
          });
        }
      }
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
      } else if (status == 'pending_deliver') {
        var valid_status = ["6"];
        this.orders = orders.filter((item) => {
          this.dataLoaded = true;
          return (valid_status.indexOf(item.estado) > -1);
        });
      } else if (status == 'incidences') {
        this.orders = orders.filter((item) => {
          this.dataLoaded = true;
          return (item.datos.notas && item.datos.notas.some(x => x.tipo === 'incidencia'));
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
    } else if (this.filter == 'pending_deliver') {
      return 'Pendientes de entregar';
    } else if (this.filter == 'incidences') {
      return 'Incidencias';
    } else {
      return 'Completados';
    }
  }

  rango() {
    if (this.dates_range && this.dates_range.from && this.dates_range.to) {
      var from_exp = this.dates_range.from.split('-');
      var to_exp = this.dates_range.to.split('-');

      return 'De ' + from_exp[2] + '-' + from_exp[1] + '-' + from_exp[0] + ' a ' + to_exp[2] + '-' + to_exp[1] + '-' + to_exp[0];
    } else {
      return '';
    }
  }

  presentFilter(myEvent) {
    let popover = this.popoverCtrl.create('OrdersFilterPage', { filter: this.filter });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data => {
      if (data && data.filter) {
        this.filterOrders(data.filter,this.dates_range);
        console.log("filtro cambiado", data.filter);
      }
    });
  }

  presentCalendar(myEvent) {
    let options: CalendarModalOptions = {
      title: 'Selecciona un rango de fechas',
      pickMode: 'range',
      canBackwardsSelected: true,
      closeIcon: true,
      doneIcon: true,
      weekStart: 1,
      weekdays: ['D', 'L', 'M', 'X', 'J', 'V', 'S']
    };
    if (this.dates_range && this.dates_range.from && this.dates_range.to) {
      options.defaultDateRange = { from: new Date(this.dates_range.from), to: new Date(this.dates_range.to) };
    }
    let myCalendar =  this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss((date: { from: CalendarResult; to: CalendarResult }, type: string) => {
      if (date && date.from && date.to) {
        let range = { from: date.from.string, to: date.to.string };
        this.filterOrders(this.filter, range);
        //this.dates_range = data.dates_range;
        console.log("rango cambiado", range, type);
      } else {
        if (type == 'cancel') {
          this.dates_range = null;
          this.filterOrders(this.filter, null);
          console.log("rango limpiado", type);
        }
      }
    });

    /*let popover = this.popoverCtrl.create('OrdersCalendarPage', { dates_range: this.dates_range });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data => {
      if (data && data.dates_range) {
        this.filterOrders(this.filter, data.dates_range);
        //this.dates_range = data.dates_range;
        console.log("rango cambiado", data.dates_range, data.dates_range.from.format('YYYY-MM-DD'), data.dates_range.to.format('YYYY-MM-DD'));
      }
    });*/
  }

  ionViewWillEnter() {
    this.filterOrders(this.filter, this.dates_range);
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
