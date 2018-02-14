import {Injectable} from '@angular/core';
import {AuthHttp} from 'angular2-jwt';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import *  as AppConfig from '../app/config';

@Injectable()
export class UsersService {

  private cfg: any;

  constructor(
    private authHttp: AuthHttp) {

    this.cfg = AppConfig.cfg;
  }

  getDrivers() {
	  var _def = 'q=&orden=nombre&ordenDir=ASC&page=1&resultados=500&lat=&lon=&categoria=7';
	  return this.authHttp.get(this.cfg.apiUrl + this.cfg.user.list + '/?' + _def)
      .toPromise()
      .then(rs => {
		console.log(rs, rs.json().resultados);
        return rs.json().resultados;
      });
  }

  getAllByOwner() {
	  var _def = 'q=&orden=nombre&ordenDir=ASC&page=1&resultados=500&lat=&lon=&solo_usuario_actual=1&incluir_padre=1';
	  return this.authHttp.get(this.cfg.apiUrl + this.cfg.user.list + '/?' + _def)
      .toPromise()
      .then(rs => {
		console.log(rs, rs.json().resultados);
        return rs.json().resultados;
      });
  }

}
