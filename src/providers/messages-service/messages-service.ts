import {Injectable} from '@angular/core';
import {AuthHttp} from 'angular2-jwt';
/*import {Headers} from '@angular/http';
import { RequestOptions } from '@angular/http';
import {MessageModel} from '../../models/message.model';
import {UserModel} from '../../models/user.model';*/
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import *  as AppConfig from '../../app/config';

@Injectable()
export class MessagesServiceProvider {

  private cfg: any;

  constructor(
    private authHttp: AuthHttp) {

    this.cfg = AppConfig.cfg;
  }
  
  getAll(tipo: string) {
	  var _def = 'q=&orden=fecha&ordenDir=DESC&page=1&resultados=14&lat=&lon=&incluir_respuestas=0&tipo_resultados=' + tipo;
	  return this.authHttp.get(this.cfg.apiUrl + this.cfg.messages.list + '/?' + _def)
      .toPromise()
      .then(rs => {
		console.log(rs, rs.json().resultados);
        return rs.json().resultados;
      });
  }
  
  getOne(id: number) {
	  var infoUrl = this.cfg.messages.info;
	  var parsedUrl = infoUrl.replace('##ID##',id);
	  return this.authHttp.get(this.cfg.apiUrl + parsedUrl)
      .toPromise()
      .then(rs => {
		console.log(rs, rs.json());
        return rs.json();
      });
  }
}
