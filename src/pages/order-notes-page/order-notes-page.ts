import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ViewController } from 'ionic-angular';
import { ProtectedPage } from '../protected-page/protected-page';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';
import { OrdersService } from '../../providers/orders-service';
import { OrderModel } from '../../models/order.model';
import {ConfigServiceProvider} from '../../providers/config-service/config-service';

@IonicPage()
@Component({
  selector: 'page-order-notes-page',
  templateUrl: 'order-notes-page.html',
})
export class OrderNotesPage extends ProtectedPage {

  private order: OrderModel;

  public notes: Array<{ nota: string, fecha: any, tipo: any, latitud: any, longitud: any, adjunto: any }>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public viewCtrl: ViewController,
    public storage: Storage,
    public authService: AuthService,
    public ordersService: OrdersService,
    public configService: ConfigServiceProvider) {

    super(navCtrl, navParams, storage, authService);

    this.order = navParams.get('order');

  }

  ionViewWillEnter() {
    this.notes = this.ordersService.getNotes(this.order);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  baseUrl(append: string) {
    if (append.substring(0,7) == 'http://' || append.substring(0,8) == 'https://'){
      return append;
    } else {
      return this.configService.baseUrl() + '/' + append;
    }
  }

  noteIcon(note: any) {
    if (note.adjunto != "") {
      return "attach";
    } else if (note.pedido_id != "0") {
      return "cube";
    } else {
      return "list-box";
    }
  }

  parseTwitterDate(time: string) {
    var date = new Date((time || "").replace(/-/g, "/").replace(/[TZ]/g, " ")),
      diff = (((new Date()).getTime() - date.getTime()) / 1000),
      day_diff = Math.floor(diff / 86400);

    if (isNaN(day_diff) || day_diff < 0/* || day_diff >= 31*/)
      return;

    if (day_diff >= 31) {
      var monthNames = [
        "ene", "feb", "mar",
        "abr", "may", "jun", "jul",
        "ago", "sep", "oct",
        "nov", "dic"
      ];

      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();

      return day + ' ' + monthNames[monthIndex] + ' ' + year;
    }


    return day_diff == 0 && (
      diff < 60 && "ahora mismo" ||
      diff < 120 && "hace 1 minuto" ||
      diff < 3600 && "hace " + Math.floor(diff / 60) + " minutos" ||
      diff < 7200 && "hace 1 hora" ||
      diff < 86400 && "hace " + Math.floor(diff / 3600) + " horas") ||
      day_diff == 1 && "ayer" ||
      day_diff < 7 && "hace " + day_diff + " días" ||
      day_diff < 31 && "hace " + Math.ceil(day_diff / 7) + " semanas";
  }
}
