import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import {ProtectedPage} from '../protected-page/protected-page';
import {Storage} from '@ionic/storage';
import {AuthService} from '../../providers/auth-service';

@IonicPage()
@Component({
  selector: 'page-order-add-document',
  templateUrl: 'order-add-document.html',
})
export class OrderAddDocumentPage extends ProtectedPage {

  order: any;

  text: any;

  documentUrl: any;

  customTitle: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public loadingCtr: LoadingController,
    public viewCtrl: ViewController,
    public storage: Storage,
    public authService: AuthService) {

    super(navCtrl, navParams, storage, authService);

    this.order = navParams.get('order');

    this.customTitle = 'Añadir documento';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderAddDocumentPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  saveDocument() {
    let data = { text: this.text, documentUrl: this.documentUrl };
    this.viewCtrl.dismiss(data);
  }

}
