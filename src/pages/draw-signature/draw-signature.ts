import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ProtectedPage } from '../protected-page/protected-page';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

@IonicPage()
@Component({
  selector: 'page-draw-signature',
  templateUrl: 'draw-signature.html',
})
export class DrawSignaturePage extends ProtectedPage {

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  private signaturePadOptions: Object = { // Check out https://github.com/szimek/signature_pad
    'minWidth': 2,
    'canvasWidth': 400,
    'canvasHeight': 200,
    'backgroundColor': '#f6fbff',
    'penColor': '#666a73'
  };

  signature: any;

  isDrawing = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public storage: Storage,
    public authService: AuthService) {
      super(navCtrl, navParams, storage, authService);
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.signaturePad.clear();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  drawComplete() {
    this.isDrawing = false;
  }

  drawStart() {
    this.isDrawing = true;
  }

  savePad() {
    this.signature = this.signaturePad.toDataURL();
    this.signaturePad.clear();
    /*let toast = this.toastCtrl.create({
      message: 'New Signature saved.',
      duration: 3000
    });
    toast.present();*/
    let data = { signature: this.signature };
    this.viewCtrl.dismiss(data);
  }

  clearPad() {
    this.signaturePad.clear();
  }



}
