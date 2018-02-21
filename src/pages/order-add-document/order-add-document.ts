import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, ModalController, LoadingController, ViewController, ToastController } from 'ionic-angular';
import { ProtectedPage } from '../protected-page/protected-page';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';
import { CameraService } from '../../providers/camera-service';
import {ConfigServiceProvider} from '../../providers/config-service/config-service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@IonicPage()
@Component({
  selector: 'page-order-add-document',
  templateUrl: 'order-add-document.html',
})
export class OrderAddDocumentPage extends ProtectedPage {

  signature: any;

  isDrawing = false;

  order: any;

  text: any;

  documentUrl: any;

  customTitle: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public loadingCtr: LoadingController,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public storage: Storage,
    public toastCtrl: ToastController,
    public authService: AuthService,
    public cameraService: CameraService,
    public transfer: FileTransfer,
    public configService: ConfigServiceProvider) {
    super(navCtrl, navParams, storage, authService);

    this.order = navParams.get('order');

    this.customTitle = 'Añadir documento';
  }

  ionViewDidEnter() {
  }

  ionViewDidLoad() {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  openSignature() {
    let modal = this.modalCtrl.create('DrawSignaturePage');
    modal.present();

    modal.onDidDismiss(data => {
      if (data && data.signature) {
        this.signature = data.signature;
        let toast = this.toastCtrl.create({
          message: 'Firma añadida',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    });
  }

  saveDocument() {
    let data = { text: this.text, documentUrl: this.documentUrl };
    this.viewCtrl.dismiss(data);
  }

  getFromCamera() {
    const loading = this.loadingCtr.create();

    loading.present();
    return this.cameraService.getPictureFromCamera().then(picture => {
      if (picture) {
        this.signature = picture;
      }
      loading.dismiss();
    }, error => {
      alert(error);
    });
  }

  getFromGallery() {
    const loading = this.loadingCtr.create();

    loading.present();
    return this.cameraService.getPictureFromPhotoLibrary().then(picture => {
      if (picture) {
        this.signature = picture;
      }
      loading.dismiss();
    }, error => {
      alert(error);
    });
  }

  generateId() {
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
  }

  upload() {
    const loading = this.loadingCtr.create();

    loading.present();

    if (this.signature) {

      const fileTransfer: FileTransferObject = this.transfer.create();

      let options1: FileUploadOptions = {
        fileKey: 'file',
        fileName: this.generateId() + '.jpg',
        headers: {}
      }

      fileTransfer.upload(this.signature, this.configService.apiUrl() + this.configService.cfg.system.upload, options1)
        .then((data) => {
          let resp = JSON.parse(data.response);

          if (resp.response == "ok") {
            this.documentUrl = resp.data.url;
            this.saveDocument();
            loading.dismiss();
          } else {
            let toast = this.toastCtrl.create({
              message: 'Se ha producido un error al subir la imagen',
              duration: 3000,
              position: 'top'
            });
            toast.present();
            loading.dismiss();
          }
        }, (err) => {
          // error
          alert("error" + JSON.stringify(err));
        });
    } else {
      this.saveDocument();
      loading.dismiss();
    }
  }

}
