import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, MenuController} from 'ionic-angular';
import {ProtectedPage} from '../protected-page/protected-page';
import {Storage} from '@ionic/storage';
import {AuthService} from '../../providers/auth-service';
import {LocationServiceProvider} from '../../providers/location-service';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsListPage extends ProtectedPage {
	gps: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public storage: Storage,
	public authService: AuthService,
	public locationService: LocationServiceProvider) {
	  super(navCtrl, navParams, storage, authService);
  }

  ionViewDidLoad() {
	  this.locationService.GPSStatus().then(ret => {
		  this.gps = ret;
		  console.log(this.gps);
	  });

  }

  canToggleGeolocation() {
    return this.locationService.globalGeolocationIsActive();
  }

  toggleGPS() {
	  this.locationService.toggleGPS().then(result => {
      if (result == 'on'){
        this.gps = true;
      } else {
        this.gps = false;
      }
		  return this.gps;
	  });
  }

}
