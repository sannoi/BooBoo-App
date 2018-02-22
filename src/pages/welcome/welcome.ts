import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ModalController, LoadingController } from 'ionic-angular';
import { PublicPage } from '../public-page/public-page';
import { Storage } from '@ionic/storage';
import {ConfigServiceProvider} from '../../providers/config-service/config-service';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage extends PublicPage {

  loading: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public storage: Storage,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public configService: ConfigServiceProvider) {
    super(navCtrl, navParams, storage);
  }

  ionViewDidLoad() {
    //hide menu when on the login page, regardless of the screen resolution
    this.menuCtrl.enable(false);
  }

  login() {
    let modal = this.modalCtrl.create('SelectSitePage');
    modal.present();

    modal.onDidDismiss(data => {
      this.loading = this.loadingCtrl.create({
        content: 'Cargando entorno...'
      });
      this.loading.present();
      if (data && data.site) {
        this.configService.changeSite(data.site).then(result => {
          this.loading.dismiss();
          if (result == true){
            this.navCtrl.push('LoginPage');
          } else {
            console.log("No se ha cambiado el sitio");
            this.navCtrl.push('LoginPage');
          }
        });
      } else {
        this.loading.dismiss();
        alert("No se han encontrado datos");
      }
    });
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }
}
