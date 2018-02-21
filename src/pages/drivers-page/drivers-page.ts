import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { ProtectedPage } from '../protected-page/protected-page';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';
import { UsersService } from '../../providers/users-service';
import { UserModel } from '../../models/user.model';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';

@IonicPage()
@Component({
  selector: 'page-drivers-page',
  templateUrl: 'drivers-page.html'
})
export class DriversPage extends ProtectedPage {

  public drivers: any;

  private _drivers: any;

  public dataLoaded: boolean = false;

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
    public usersService: UsersService,
    public configService: ConfigServiceProvider) {

    super(navCtrl, navParams, storage, authService);

    this.dataLoaded = false;

    this.customTitle = navParams.get('pageTitle');

    this.listType = navParams.get('listType');

  }

  ionViewWillEnter() {
    if (this.listType != 'owner') {
      this.loading = this.loadingCtr.create({ content: "Cargando conductores..." });

      this.loading.present().then(() => {
        this.usersService.getDrivers().then((drivers) => {
          this.drivers = drivers;
          this._drivers = drivers;
          this.dataLoaded = true;
          this.loading.dismiss();
        });
      });
    } else {
      this.loading = this.loadingCtr.create({ content: "Cargando usuarios..." });

      this.loading.present().then(() => {
        this.usersService.getAll().then((drivers) => {
          this.drivers = drivers;
          this._drivers = drivers;
          this.dataLoaded = true;
          this.loading.dismiss();
        });
      });
    }
  }

  filterItems(ev: any) {
    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.drivers = this._drivers.filter((item) => {
        return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.email.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else if (val.trim() == '') {
      this.drivers = this._drivers;
    }
  }

  getBaseUrl() {
    return this.configService.baseUrl() + '/';
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
