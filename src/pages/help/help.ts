import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
  }

  ionViewDidLoad() { }

  verTutorial() {
    this.storage.remove('hasSeenTutorial').then(() => {
      this.navCtrl.setRoot('ProfilePage');
    });
  }

  gotoPage(component: any) {
    this.navCtrl.push(component);
  }

  mailto(email) {
     window.open('mailto:' + email, '_system');
  }

}
