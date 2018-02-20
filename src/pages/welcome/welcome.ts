import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ModalController } from 'ionic-angular';
import { PublicPage } from '../public-page/public-page';
import { Storage } from '@ionic/storage';
import {ConfigServiceProvider} from '../../providers/config-service/config-service';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage extends PublicPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public storage: Storage,
    public modalCtrl: ModalController,
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
      console.log(data);
      if (data && data.site) {
        this.configService.changeSite(data.site).then(result => {
          if (result == true){
            this.navCtrl.push('LoginPage');
          } else {
            console.log("No se ha cambiado el sitio");
            this.navCtrl.push('LoginPage');
          }
        });
      }
    });
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }
}
