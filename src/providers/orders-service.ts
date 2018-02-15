import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Headers } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { OrderModel } from '../models/order.model';
import { UserModel } from '../models/user.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import *  as AppConfig from '../app/config';

@Injectable()
export class OrdersService {

  private cfg: any;

  constructor(
    private authHttp: AuthHttp) {

    this.cfg = AppConfig.cfg;
  }

  getAll(onlyNotAssigned: boolean) {
    var _def = 'q=&orden=fecha&ordenDir=DESC&page=1&resultados=14&lat=&lon=';
    if (onlyNotAssigned == true) {
      _def = _def + '&solo_disponibles=1';
    }
    return this.authHttp.get(this.cfg.apiUrl + this.cfg.orders.list + '/?' + _def)
      .toPromise()
      .then(rs => {
        console.log(rs, rs.json().resultados);
        return rs.json().resultados;
      });
  }

  getNotes(order: OrderModel) {
    console.log(order.datos.notas);
    return order.datos.notas;
  }

  getOne(id: number) {
    var infoUrl = this.cfg.orders.info;
    var parsedUrl = infoUrl.replace('##ID##', id);
    return this.authHttp.get(this.cfg.apiUrl + parsedUrl)
      .toPromise()
      .then(rs => {
        console.log(rs, rs.json());
        return rs.json();
      });
  }

  assignOrder(order: OrderModel, driver: UserModel, provider: any, token: string) {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
    });
    let options = new RequestOptions({
      headers: headers
    });
    let data = { pedido_id: order.id, proveedor_id: provider.id, conductor_id: driver.id, token: token };

    return this.authHttp.post(this.cfg.apiUrl + this.cfg.orders.assign, this.serializeObj(data), options)
      .toPromise()
      .then(rs => {
        return rs.json();
      });
  }

  pickupOrder(order: OrderModel, driver: UserModel, token: string) {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
    });
    let options = new RequestOptions({
      headers: headers
    });
    let data = { pedido_id: order.id, conductor_id: driver.id, token: token };

    return this.authHttp.post(this.cfg.apiUrl + this.cfg.orders.pickup, this.serializeObj(data), options)
      .toPromise()
      .then(rs => {
        return rs.json();
      });
  }

  storeOrder(order: OrderModel, driver: UserModel, token: string) {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
    });
    let options = new RequestOptions({
      headers: headers
    });
    let data = { pedido_id: order.id, conductor_id: driver.id, token: token };

    return this.authHttp.post(this.cfg.apiUrl + this.cfg.orders.store, this.serializeObj(data), options)
      .toPromise()
      .then(rs => {
        return rs.json();
      });
  }

  addDocumentOrder(order: OrderModel, driver: UserModel, text: any, docUrl: any, token: string) {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;'
    });
    let options = new RequestOptions({
      headers: headers
    });
    let data = { pedido_id: order.id, conductor_id: driver.id, archivo_adjunto_pedido: docUrl, texto_nota: text, token: token };
    if (!text){
      data.texto_nota = "";
    }
    if (!docUrl){
      data.archivo_adjunto_pedido = "";
    }

    return this.authHttp.post(this.cfg.apiUrl + this.cfg.orders.add_document, this.serializeObj(data), options)
      .toPromise()
      .then(rs => {
        return rs.json();
      });
  }

  public serializeObj(obj) {
    var result = [];

    for (var property in obj)
      result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));

    return result.join("&");
  }

}
