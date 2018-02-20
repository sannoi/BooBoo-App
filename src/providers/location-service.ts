import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
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
    public http: Http,
    public alertCtrl: AlertController) {
    this.cfg = AppConfig.cfg;

    if (this.cfg.extensions_active.geolocation) {
      this.storage.get('gps').then(gps => {
        this.gps = gps;

        if (this.gps == 'on') {
          this.enableGeolocation();
        } else {
          this.disableGeolocation();
        }
      });
    }
  }

  public checkEnableGeolocation() {
    return this.storage.get('user').then(usr => {
      if (this.cfg.extensions_active.geolocation) {
        if (usr && usr.categorias) {
          let categorias = JSON.parse(usr.categorias);
          if (categorias[0] == '7') {
            return this.storage.get('gps').then(gps => {
              if (this.gps != 'on') {
                return true;
              } else {
                return false;
              }
            });
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
  }

  refreshGeolocation() {
    if (this.cfg.extensions_active.geolocation) {
      this.storage.get('gps').then(gps => {
        this.gps = gps;

        if (this.gps == 'on') {
          this.enableGeolocation();
        } else {
          this.disableGeolocation();
        }
      });
    }
  }

  enableGeolocation() {
    if (this.cfg.extensions_active.geolocation) {
      this.geolocation.getCurrentPosition().then((resp) => {
        this.position = resp.coords;
        //alert("geolocation activated!");
      }).catch((error) => {
        console.log('Error getting location', error);
      });

      this.watcher = this.geolocation.watchPosition()
        .subscribe(position => {
          this.position = position.coords;
          //alert("geolocation updated!");
          console.log("enableLocation: " + position.coords.longitude + ' ' + position.coords.latitude);
        });
    }
  }

  disableGeolocation() {
    if (this.watcher) {
      //alert("geolocation disabled!");
      this.watcher.unsubscribe();
      console.log("Geolocation off");
    }
  }

  globalGeolocationIsActive() {
    return this.cfg.extensions_active.geolocation;
  }

  GPSStatus() {
    return this.storage.get('gps')
      .then(gps => {
        if (this.cfg.extensions_active.geolocation) {
          if (gps == 'on') {
            return true;
          } else {
            return false;
          }
        } else {
          this.storage.set('gps', 'off');
          return false;
        }
      });
  }

  toggleGPS() {
    return this.storage.get('gps')
      .then(gps => {
        if (this.cfg.extensions_active.geolocation) {
          if (!gps || gps == 'off') {
            this.gps = 'on';
            this.enableGeolocation();
          } else {
            this.gps = 'off';
            this.disableGeolocation();
          }
          this.storage.set('gps', this.gps);
        } else {
          this.gps = 'off';
        }

        return this.gps;
      });
  }

}
