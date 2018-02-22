import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {ConfigServiceProvider} from '../config-service/config-service';

@Injectable()
export class MessagesServiceProvider {

  constructor(
    private authHttp: AuthHttp,
    private configService: ConfigServiceProvider) { }

    initialize() {
      console.log("messages service initialized!");
      return new Promise<boolean>((resolve, reject) => {
        resolve(false);
      });
    }

  getAll(tipo: string) {
    var _def = 'q=&orden=fecha&ordenDir=DESC&page=1&resultados=14&lat=&lon=&incluir_respuestas=0&tipo_resultados=' + tipo;
    return this.authHttp.get(this.configService.apiUrl() + this.configService.cfg.messages.list + '/?' + _def)
      .toPromise()
      .then(rs => {
        console.log(rs, rs.json().resultados);
        return rs.json().resultados;
      });
  }

  getOne(id: number) {
    var infoUrl = this.configService.cfg.messages.info;
    var parsedUrl = infoUrl.replace('##ID##', id);
    return this.authHttp.get(this.configService.apiUrl() + parsedUrl)
      .toPromise()
      .then(rs => {
        console.log(rs, rs.json());
        return rs.json();
      });
  }

  getUserChat(idUser: any) {
    var _def = 'q=&orden=fecha&ordenDir=DESC&page=1&resultados=1&incluir_respuestas=0&tipo_resultados=userChat&userChatId=' + idUser;
    return this.authHttp.get(this.configService.apiUrl() + this.configService.cfg.messages.list + '/?' + _def)
      .toPromise()
      .then(rs => {
        return rs.json().resultados;
      });
  }

  sendResponse(data: any) {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
    });
    let options = new RequestOptions({
      headers: headers
    });

    let datos = this.serializeObj(data);

    return this.authHttp.post(this.configService.apiUrl() + this.configService.cfg.messages.response, datos, options)
      .toPromise()
      .then(rs => {
        console.log(rs.json());
        return rs.json();
      });
  }

  markAsReaded(data: any) {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
    });
    let options = new RequestOptions({
      headers: headers
    });

    let datos = this.serializeObj(data);

    return this.authHttp.post(this.configService.apiUrl() + this.configService.cfg.messages.readed, datos, options)
      .toPromise()
      .then(rs => {
        return rs.json();
      });
  }

  public serializeObj(obj) {
    var result = [];

    for (var property in obj) {
      if (property == 'destinatarios') {
        result.push(encodeURIComponent(property) + "[]=" + encodeURIComponent(obj[property]));
      } else if (property == 'alias') {
        result.push(encodeURIComponent(property) + "[es]=" + encodeURIComponent(obj[property]));
      } else {
        result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
      }
    }

    return result.join("&");
  }
}
