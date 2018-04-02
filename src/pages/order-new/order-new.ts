import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';

@IonicPage()
@Component({
  selector: 'page-order-new',
  templateUrl: 'order-new.html',
})
export class OrderNewPage {

  url: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sanitize: DomSanitizer, private configService: ConfigServiceProvider) {
    this.url = sanitize.bypassSecurityTrustResourceUrl(configService.currentSite.baseUrl + "/es/Confirmar-datos-de-usuario");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderNewPage');
  }

}
