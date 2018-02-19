import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { UserModel } from '../models/user.model';
import { CredentialsModel } from '../models/credentials.model';
import { AuthHttp, JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { LocationServiceProvider } from './location-service';
import { UsersService } from './users-service';
import { Observable } from 'rxjs/Rx';
import *  as AppConfig from '../app/config';
import { AlertController } from 'ionic-angular';

@Injectable()
export class AuthService {

  private cfg: any;
  firebaseToken: any;
  idToken: string;
  formToken: string;
  config: any;
  usr: any;
  userType: string;
  refreshSubscription: any;
  lastError: any;
  lastSavedPos: any;

  constructor(
    public alertCtrl: AlertController,
    public locationService: LocationServiceProvider,
    public usersService: UsersService,
    private storage: Storage,
    private http: Http,
    private jwtHelper: JwtHelper,
    private authHttp: AuthHttp) {
    this.cfg = AppConfig.cfg;

    this.storage.get('id_token').then(token => {
      this.idToken = token;
    });

    this.storage.get('formToken').then(token => {
      this.formToken = token;
    });

    this.storage.get("userType").then(userType => {
      this.userType = userType;
    });

    this.storage.get("user").then(user => {
      this.usr = user;
    });

    this.storage.get("config").then(config => {
      this.config = config;
      if (!this.config) {
        this.loadConfig();
      }
    });

  }

  loadConfig() {
    return this.http.get(this.cfg.apiUrl + this.cfg.configUrl)
      .toPromise()
      .then(data => {
        this.config = data.json().data;
        this.storage.set("config", data.json().data);
      })
      .catch(e => console.log("reg error", e));
  }

  register(userData: UserModel) {
    return this.http.post(this.cfg.apiUrl + this.cfg.user.register, userData)
      .toPromise()
      .then(data => {
        this.saveData(data)
        let rs = data.json();
        this.idToken = rs.token;
        this.scheduleRefresh();
      })
      .catch(e => console.log("reg error", e));
  }

  login(credentials: CredentialsModel) {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.cfg.apiUrl + this.cfg.user.login, this.serializeObj(credentials), options)
      .toPromise().then(data => {
        let rs = data.json();
        if (rs.response == "error") {
          this.lastError = rs.response_text;
          return false;
        } else {
          return this.usersService.saveFirebaseDeviceToken(this.firebaseToken).then(result => {
            console.log('Token de Firebase guardado: ' + this.firebaseToken);
            this.saveData(data);
            this.idToken = rs.data.jwt;
            this.usr = rs.data.usr;
            this.getFormToken();
            return true;
          });
          //this.scheduleRefresh();
        }
      })
      .catch(e => console.log('login error', e));

  }

  saveData(data: any) {
    let rs = data.json();
    this.storage.set("user", rs.data.usr);
    this.storage.set("id_token", rs.data.jwt);

    if (rs.data.usr.permisos_app.canAssignOrders == '1') {
      this.userType = "proveedor";
    } else if (rs.data.usr.permisos_app.canManageOrderStates == '1') {
      this.userType = "conductor";
    } else {
      this.userType = "cliente";
    }

    this.storage.set("userType", this.userType);
  }

  logout() {
    return this.usersService.clearFirebaseDeviceToken().then(result => {
      // stop function of auto refesh
      //this.unscheduleRefresh();
      this.storage.remove('user');
      this.storage.remove('id_token');
      this.storage.remove('userType');
      this.storage.remove('formToken');

      this.idToken = null;
      this.usr = null;
      this.userType = null;

      this.getFormToken();

      return result;
    });
  }

  isValid() {
    return tokenNotExpired();
  }

  public isUserAuthenticated() {
    if (this.idToken === null) {
      return false;
    } else {
      return true;
    }
  }

  public serializeObj(obj) {
    var result = [];

    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  }

  public getNewJwt() {
    console.log('Get New JWT');
    // Get a new JWT from Auth0 using the refresh token saved
    // in local storage

    this.storage.get("id_token").then((thetoken) => {
      /*let senddata: { Token:string} = {
           Token : thetoken
        };*/
      this.authHttp.get(this.cfg.apiUrl + this.cfg.user.formToken)
        .map(res => res.json())
        .subscribe(res => {
          console.log(JSON.stringify(res));
          console.log(res.response);
          // If the API returned a successful response, mark the user as logged in
          // this need to be fixed on Laravel project to retun the New Token ;
          if (res.response == 'ok') {
            this.storage.set("id_token", thetoken);
            this.storage.set("formToken", res.response_text);

            this.idToken = thetoken;
            this.formToken = res.response_text;

          } else {
            console.log("The Token Black Listed");
            this.logout();

          }
        }, err => {
          console.error('ERROR', err);
        });

    });

  }

  public startupCheckGeolocation() {
    let pos = this.locationService.position;

    //if (pos) {
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
      //this.getNewJwt();
      //this.scheduleRefresh();
      this.storage.get("gps").then((gps) => {
        if (gps && gps == 'on') {
          console.log("Check location loop: on");
          if (this.locationService.position && this.locationService.position != this.lastSavedPos && this.usr) {
            let categorias = JSON.parse(this.usr.categorias);
            if (categorias[0] == '7') {
              this.usersService.saveGeolocation().then(res => {
                console.log(res);
                //alert("Location changed and saved!");
                this.lastSavedPos = this.locationService.position;
              });
            }
          }
        } else {
          console.log("Check location loop: off");
        }
      });


    });
    //}
  }

  public scheduleRefresh() {
    // If the user is authenticated, use the token stream
    // provided by angular2-jwt and flatMap the token
    /*console.log(this.idToken);
    let source = Observable.of(this.idToken).flatMap(
      token => {
        // The delay to generate in this case is the difference
        // between the expiry time and the issued at time
        let jwtIat = this.jwtHelper.decodeToken(token).iat;
        let jwtExp = this.jwtHelper.decodeToken(token).exp;

      console.log(jwtIat);
      console.log(jwtExp);

        let iat = new Date(0);
        let exp = new Date(0);

      console.log(iat);
      console.log(exp);
      let delay = 10000;
       //let delay = (exp.setUTCSeconds(jwtExp) - iat.setUTCSeconds(jwtIat));
        console.log("will start refresh after :",(delay/1000)/60);
       // if(delay-1000<=0)
       // delay = 1;
        return Observable.interval(delay);
      });

    this.refreshSubscription = source.subscribe(() => {
      this.getNewJwt();
    });*/
  }

  public startupTokenRefresh() {
    // If the user is authenticated, use the token stream
    // provided by angular2-jwt and flatMap the token

    /*this.storage.get("id_token").then((thetoken)=>{

      if(thetoken){

        let source = Observable.of(thetoken).flatMap(
          token => {
            // Get the expiry time to generate
            // a delay in milliseconds
            let now: number = new Date().valueOf();
            let jwtExp: number = this.jwtHelper.decodeToken(token).exp;
            let exp: Date = new Date(0);
            exp.setUTCSeconds(jwtExp);
            let delay: number = exp.valueOf() - now;

            if(delay <= 0) {
              delay=1;
            }
             // Use the delay in a timer to
            // run the refresh at the proper time
            return Observable.timer(delay);
          });

         // Once the delay time from above is
         // reached, get a new JWT and schedule
         // additional refreshes
         source.subscribe(() => {
           this.getNewJwt();
           this.scheduleRefresh();
         });

      }else{
        //there is no user logined
        console.info("there is no user logined ");
      }

    });*/


  }

  public getFormToken() {
    return this.authHttp.post(this.cfg.apiUrl + this.cfg.user.formToken, '')
      .toPromise()
      .then(data => {
        let rs = data.json();
        //this.saveData(data);
        //console.log(rs);
        //console.log(rs.response_text);
        this.storage.set("formToken", rs.response_text);
        this.formToken = rs.response_text;
        return rs.response_text;

        //this.idToken = rs.token;
        //this.scheduleRefresh();
      })
      .catch(e => console.log('login error', e));
  }




  public unscheduleRefresh() {
    // Unsubscribe fromt the refresh
    /*if (this.refreshSubscription) {
    this.refreshSubscription.unsubscribe();
    }*/
  }

}
