import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import 'rxjs/add/operator/map';
import {ConfigServiceProvider} from './config-service/config-service';

@Injectable()
export class LocationServiceProvider {

  gps: any;
  watcher: any;
  position: any;

  constructor(
    public geolocation: Geolocation,
    private storage: Storage,
    public http: Http,
    public configService: ConfigServiceProvider,
    public alertCtrl: AlertController) {
    if (this.configService.cfg.extensions_active.geolocation) {
      this.gps = this.configService.getAppSetting("geolocation");
      if (this.gps == 'on'){
        this.enableGeolocation();
      } else {
        this.disableGeolocation();
      }
    }
  }

  public checkEnableGeolocation() {
    return this.storage.get('user').then(usr => {
      if (this.configService.cfg.extensions_active.geolocation) {
        if (usr && usr.categorias) {
          let categorias = JSON.parse(usr.categorias);
          if (categorias[0] == '7') {
            this.gps = this.configService.getAppSetting("geolocation");
            if (this.gps != 'on') {
              return true;
            } else {
              return false;
            }
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
    if (this.configService.cfg.extensions_active.geolocation) {
      this.gps = this.configService.getAppSetting("geolocation");
      if (this.gps == 'on') {
        this.enableGeolocation();
      } else {
        this.disableGeolocation();
      }
    }
  }

  enableGeolocation() {
    if (this.configService.cfg.extensions_active.geolocation) {
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
    return this.configService.cfg.extensions_active.geolocation;
  }

  GPSStatus() {
    this.gps = this.configService.getAppSetting("geolocation");
    if (this.configService.cfg.extensions_active.geolocation) {
      if (this.gps == 'on') {
        return true;
      } else {
        return false;
      }
    } else {
      this.configService.setAppSetting("geolocation", "off");
      return false;
    }
  }

}
