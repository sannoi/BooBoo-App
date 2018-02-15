import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import 'rxjs/add/operator/map';
import *  as AppConfig from '../app/config';

@Injectable()
export class LocationServiceProvider {

  private cfg: any;
  gps: any;
  watcher: any;
  position: any;

  constructor(
    public geolocation: Geolocation,
    private storage: Storage,
    public http: Http) {
    this.cfg = AppConfig.cfg;

    this.storage.get('gps').then(gps => {
      this.gps = gps;

      if (this.gps == 'on') {
        this.enableGeolocation();
      } else {
        this.disableGeolocation();
      }
    });
  }

  enableGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.position = resp.coords;
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    this.watcher = this.geolocation.watchPosition()
      .subscribe(position => {
        this.position = position.coords;
        console.log("enableLocation: " + position.coords.longitude + ' ' + position.coords.latitude);
      });
  }

  disableGeolocation() {
    if (this.watcher) {
      this.watcher.unsubscribe();
      console.log("Geolocation off");
    }
  }

  GPSStatus() {
    return this.storage.get('gps')
      .then(gps => {
        if (gps == 'on') {
          return true;
        } else {
          return false;
        }
      });
  }

  toggleGPS() {
    return this.storage.get('gps')
      .then(gps => {
        if (!gps || gps == 'off') {
          this.gps = 'on';
          this.enableGeolocation();
        } else {
          this.gps = 'off';
          this.disableGeolocation();
        }
        this.storage.set('gps', this.gps);

        return this.gps;
      });
  }

}
