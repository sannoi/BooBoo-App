import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, MenuController} from 'ionic-angular';
import {PublicPage} from '../public-page/public-page';
import {Storage} from '@ionic/storage';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage extends PublicPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public storage: Storage) {
		super(navCtrl, navParams, storage);
	}
	
  ionViewDidLoad() {
    //hide menu when on the login page, regardless of the screen resolution
    this.menuCtrl.enable(false);
  }

  login() {
    this.navCtrl.push('LoginPage');
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }
}
