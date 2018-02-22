import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { UsersService } from './users-service';
import { ConfigServiceProvider } from './config-service/config-service';

@Injectable()
export class LocationServiceProvider {

  gps: any;
  watcher: any;
  position: any;
  lastSavedPos: any;

  constructor(
    public geolocation: Geolocation,
    private storage: Storage,
    public http: Http,
    public usersService: UsersService,
    public configService: ConfigServiceProvider,
    public alertCtrl: AlertController) { }

  initialize() {
    console.log("Geolocation service initialized!");
    this.refreshGeolocation();
    this.startupCheckGeolocation();

    return this.checkEnableGeolocation().then(res => {
      if (res) {
        return {
          modal: {
            enableBackdropDismiss: false,
            title: 'Geolocalización desactivada',
            message: 'Es recomendable activar la geolocalización para que todas las características de BooBoo funcionen correctamente. Por favor, accede a Configuración y después activa la opción Geolocalización.',
          },
          modal_buttons: [
            { text: "No, gracias", role: "cancel" },
            { text: "Ir a Configuración", navToMenuLink: 5 }
          ]
        };
      } else {
        return false;
      }
    });
  }

  public checkEnableGeolocation() {
    return this.storage.get('user').then(usr => {
      if (this.configService.cfg.extensions.geolocation.active) {
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

  public startupCheckGeolocation() {
    let pos = this.position;
    let source = Observable.of(pos).flatMap(
      position => {
        let delay: number = 10000;

        if (delay <= 0) {
          delay = 1;
        }
        // Use the delay in a timer to
        // run the refresh at the proper time
        return Observable.interval(delay);
      });

    // Once the delay time from above is
    // reached, get a new JWT and schedule
    // additional refreshes
    source.subscribe(() => {
      if (this.gps && this.gps == 'on') {
        console.log("Check location loop: on");
        this.storage.get('user').then(usr => {
          if (this.position && this.position != this.lastSavedPos && usr) {
            let categorias = JSON.parse(usr.categorias);
            if (categorias.indexOf('7') !== -1) {
              this.usersService.saveGeolocation(this.position.latitude, this.position.longitude).then(res => {
                console.log(res);
                this.lastSavedPos = this.position;
              });
            }
          }
        });
      } else {
        console.log("Check location loop: off");
      }

    });
  }

  refreshGeolocation() {
    if (this.configService.cfg.extensions.geolocation.active) {
      this.gps = this.configService.getAppSetting("geolocation");
      if (this.gps == 'on') {
        this.enableGeolocation();
      } else {
        this.disableGeolocation();
      }
    }
  }

  enableGeolocation() {
    if (this.configService.cfg.extensions.geolocation.active) {
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
    return this.configService.cfg.extensions.geolocation.active;
  }

  GPSStatus() {
    this.gps = this.configService.getAppSetting("geolocation");
    if (this.configService.cfg.extensions.geolocation.active) {
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
