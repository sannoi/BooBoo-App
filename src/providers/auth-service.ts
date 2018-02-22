import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { UserModel } from '../models/user.model';
import { CredentialsModel } from '../models/credentials.model';
import { AuthHttp, JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { LocationServiceProvider } from './location-service';
import { UsersService } from './users-service';
import { Observable } from 'rxjs/Rx';
import { AlertController } from 'ionic-angular';
import {ConfigServiceProvider} from './config-service/config-service';

@Injectable()
export class AuthService {

  firebaseToken: any;
  idToken: string;
  formToken: string;
  private usr: BehaviorSubject<any>;
  userType: string;
  refreshSubscription: any;
  lastError: any;

  constructor(
    public alertCtrl: AlertController,
    public locationService: LocationServiceProvider,
    public usersService: UsersService,
    private storage: Storage,
    private http: Http,
    private jwtHelper: JwtHelper,
    private authHttp: AuthHttp,
    private configService: ConfigServiceProvider) {
      this.usr = new BehaviorSubject(null);
    }

    initialize() {
      return this.initializeUser();
    }

  public initializeUser() {
    return this.storage.get('id_token').then(token => {
      this.idToken = token;
      return this.storage.get('formToken').then(token => {
        this.formToken = token;
        return this.storage.get("userType").then(userType => {
          this.userType = userType;
          return this.storage.get("user").then(user => {
            this.setUsr(user);
            return user;
          });
        });
      });
    });
  }

  register(userData: UserModel) {
    return this.http.post(this.configService.apiUrl() + this.configService.cfg.user.register, userData)
      .toPromise()
      .then(data => {
        this.saveData(data)
        let rs = data.json();
        this.idToken = rs.token;
      })
      .catch(e => console.log("reg error", e));
  }

  login(credentials: CredentialsModel) {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT'
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.configService.apiUrl() + this.configService.cfg.user.login, this.serializeObj(credentials), options)
      .toPromise().then(data => {
        let rs = data.json();
        if (rs.response == "error") {
          this.lastError = rs.response_text;
          return false;
        } else {
          return this.usersService.saveFirebaseDeviceToken(this.firebaseToken).then(result => {
            console.log('Token de Firebase guardado: ' + this.firebaseToken);
            return this.saveData(data).then(res => {
              this.idToken = rs.data.jwt;
              this.setUsr(rs.data.usr);
              this.getFormToken();
              return true;
            });

          });
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

    return this.storage.set("userType", this.userType).then(uType => {
      return true
    });
  }

  logout() {
    return this.authHttp.get(this.configService.apiUrl() + this.configService.cfg.user.logout).toPromise().then(res => {
      return this.usersService.clearFirebaseDeviceToken().then(result => {
        return this.storage.clear().then(() => {
          this.formToken = null;
          this.idToken = null;
          this.setUsr(null);
          this.userType = null;

          //this.getFormToken();

          return result;
        });
      });
    });

  }

  public getUsr() {
    return this.usr.value;
  }

  public getUsrAsObservable() {
    return this.usr.asObservable();
  }

  public setUsr(val) {
    this.usr.next(val);
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
      this.authHttp.get(this.configService.apiUrl() + this.configService.cfg.user.formToken)
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

  public getFormToken() {
    return this.authHttp.post(this.configService.apiUrl() + this.configService.cfg.user.formToken, '')
      .toPromise()
      .then(data => {
        let rs = data.json();
        this.storage.set("formToken", rs.response_text);
        this.formToken = rs.response_text;
        return rs.response_text;
      })
      .catch(e => console.log('login error', e));
  }
}
