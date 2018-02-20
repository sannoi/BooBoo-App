import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import {ConfigServiceProvider} from '../../providers/config-service/config-service';

@IonicPage()
@Component({
  selector: 'page-select-site',
  templateUrl: 'select-site.html',
})
export class SelectSitePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public configService: ConfigServiceProvider) {
  }

  ionViewDidLoad() {
  }

  availableSites() {
    return this.configService.cfg.sites;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  selectSite(site: any) {
    let data = { site: site };
    this.viewCtrl.dismiss(data);
  }

}
