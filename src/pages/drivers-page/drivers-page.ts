import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { ProtectedPage } from '../protected-page/protected-page';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';
import { UsersService } from '../../providers/users-service';
import { UserModel } from '../../models/user.model';
import *  as AppConfig from '../../app/config';

@IonicPage()
@Component({
  selector: 'page-drivers-page',
  templateUrl: 'drivers-page.html'
})
export class DriversPage extends ProtectedPage {

  private cfg: any;

  public drivers: any;

  public customTitle: string;

  public listType: string;

  public loading: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public loadingCtr: LoadingController,
    public viewCtrl: ViewController,
    public storage: Storage,
    public authService: AuthService,
    public usersService: UsersService) {

    super(navCtrl, navParams, storage, authService);

    this.cfg = AppConfig.cfg;

    this.customTitle = navParams.get('pageTitle');

    this.listType = navParams.get('listType');

  }

  ionViewWillEnter() {
    if (this.listType != 'owner') {
      this.loading = this.loadingCtr.create({ content: "Cargando conductores..." });

      this.loading.present().then(() => {
        this.usersService.getDrivers().then((drivers) => {
          this.drivers = drivers;
          this.loading.dismiss();
        });
      });
    } else {
      this.loading = this.loadingCtr.create({ content: "Cargando usuarios..." });

      this.loading.present().then(() => {
        this.usersService.getAll().then((drivers) => {
          this.drivers = drivers;
          this.loading.dismiss();
        });
      });
    }
  }

  getBaseUrl() {
    return this.cfg.baseUrl + '/';
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }

  selectDriver(driver: UserModel) {
    let data = { driver: driver };
    this.viewCtrl.dismiss(data);
  }
}
