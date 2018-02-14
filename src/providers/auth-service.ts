import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Storage} from '@ionic/storage';
import {Headers} from '@angular/http';
import { RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {UserModel} from '../models/user.model';
import {CredentialsModel} from '../models/credentials.model';
import {AuthHttp, JwtHelper, tokenNotExpired} from 'angular2-jwt';
//import {Observable} from 'rxjs/Rx';
import *  as AppConfig from '../app/config';
import { AlertController } from 'ionic-angular';

@Injectable()
export class AuthService {

  private cfg: any;
  idToken: string;
  formToken: string;
  usr: any;
  userType: string;
  refreshSubscription: any;

  constructor(
	public alertCtrl: AlertController,
    private storage: Storage,
    private http: Http,
    private jwtHelper:JwtHelper,
    private authHttp: AuthHttp) {
    this.cfg = AppConfig.cfg;

	console.log(this.storage.get('id_token'));
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
		console.log(data);
		 let rs = data.json();
		 if (rs.response == "error"){
			 let alert = this.alertCtrl.create({
			  title: 'Error',
			  subTitle: rs.response_text,
			  buttons: ['OK']
			});
			alert.present();
		 } else {
		 this.saveData(data);
		 console.log(rs);
		 this.idToken = rs.data.jwt;
		 this.usr = rs.data.usr;
		 this.getFormToken();
		 //this.scheduleRefresh();
		 }
	  })
	  .catch(e => console.log('login error', e));

  }

  saveData(data: any) {
    let rs = data.json();
	//console.log(rs.data.usr);
    this.storage.set("user", rs.data.usr);
    this.storage.set("id_token", rs.data.jwt);

	if (rs.data.usr.permisos_app.canAssignOrders == '1'){
		this.userType = "proveedor";
	} else if (rs.data.usr.permisos_app.canManageOrderStates == '1'){
		this.userType = "conductor";
	} else {
		this.userType = "cliente";
	}

	this.storage.set("userType", this.userType);
  }

  logout() {
    // stop function of auto refesh
    //this.unscheduleRefresh();
    this.storage.remove('user');
    this.storage.remove('id_token');
	this.storage.remove('userType');
	this.storage.remove('formToken');
  }

  isValid() {
    return tokenNotExpired();
  }

  public isUserAuthenticated() {
	  if (this.idToken === null){
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

    this.storage.get("id_token").then((thetoken)=>{
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
            if(res.response == 'ok') {
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

public getFormToken(){

	  return this.authHttp.post(this.cfg.apiUrl + this.cfg.user.formToken,'')
      .toPromise()
      .then(data => {
         let rs = data.json();
         //this.saveData(data);
		 //console.log(rs);
		 console.log(rs.response_text);
		 this.storage.set("formToken", rs.response_text);
		 this.formToken = rs.response_text;
         return rs.response_text;

		  //this.idToken = rs.token;
         //this.scheduleRefresh();
      })
      .catch(e => console.log('login error', e));



//				var promise = $http({
//						url: urls.BASE_API + '/apps/Mideas/formToken.json',
//						method: 'get',
//						transformRequest: transformRequestAsFormPost,
//						headers: {'withCredentials': 'true', 'Bearer':Bearer}
//						//data: Object.toparams(formData)
//						//data: formData
//					}).then(function(response) {
//				   //console.log(response);
//					return response.data;
//				});
//				return promise;

		}




public unscheduleRefresh() {
// Unsubscribe fromt the refresh
/*if (this.refreshSubscription) {
this.refreshSubscription.unsubscribe();
}*/
}

}
