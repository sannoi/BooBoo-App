import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, MenuController} from 'ionic-angular';
import {ProtectedPage} from '../protected-page/protected-page';
import {Storage} from '@ionic/storage';
import {AuthService} from '../../providers/auth-service';
import {LocationServiceProvider} from '../../providers/location-service';
import {NotificationsServiceProvider} from '../../providers/notifications-service/notifications-service';
import {ConfigServiceProvider} from '../../providers/config-service/config-service';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsListPage extends ProtectedPage {
	gps: any;
  notifications: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public storage: Storage,
	public authService: AuthService,
	public locationService: LocationServiceProvider,
  public notificationsService: NotificationsServiceProvider,
  public configService: ConfigServiceProvider) {
	  super(navCtrl, navParams, storage, authService);
  }

  ionViewDidLoad() {
    let _value = this.configService.getAppSetting('geolocation');
    if (_value == 'on') {
      this.gps = true;
    } else {
      this.gps = false;
    }
    let _value2 = this.configService.getAppSetting('notifications');
    if (_value2 == 'on') {
      this.notifications = true;
    } else {
      this.notifications = false;
    }
  }

  canToggleGeolocation() {
    return this.configService.cfg.extensions.geolocation.active;
  }

  canToggleNotifications() {
    return this.configService.cfg.extensions.notifications.active;
  }

  toggleGPS() {
    let _value = this.configService.getAppSetting('geolocation');
    if (_value == 'on') {
      this.configService.setAppSetting('geolocation', 'off').then(settings => {
        this.locationService.disableGeolocation();
        this.gps = false;
        return this.gps;
      });
    } else {
      this.configService.setAppSetting('geolocation', 'on').then(settings => {
        this.locationService.enableGeolocation();
        this.gps = true;
        return this.gps;
      });
    }
  }

  toggleNotifications() {
    let _value = this.configService.getAppSetting('notifications');
    if (_value == 'on') {
      this.configService.setAppSetting('notifications', 'off');
      this.notificationsService.disableNotifications();
      this.notifications = false;
      return this.notifications;
    } else {
      this.configService.setAppSetting('notifications', 'on');
      this.notificationsService.enableNotifications();
      this.notifications = true;
      return this.notifications;
    }
  }

}
