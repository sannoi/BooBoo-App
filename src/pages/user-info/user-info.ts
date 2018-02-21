import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { ProtectedPage } from '../protected-page/protected-page';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';

@IonicPage()
@Component({
  selector: 'page-user-info',
  templateUrl: 'user-info.html',
})
export class UserInfoPage extends ProtectedPage {

  usr: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public storage: Storage,
    public authService: AuthService) {

    super(navCtrl, navParams, storage, authService);

    this.usr = navParams.get('user');

    console.log(this.usr);

  }

  ionViewDidLoad() {
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
