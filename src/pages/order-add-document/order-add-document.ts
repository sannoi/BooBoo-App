import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, LoadingController, ViewController, ToastController } from 'ionic-angular';
import { ProtectedPage } from '../protected-page/protected-page';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';
import { CameraService } from '../../providers/camera-service';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
//import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@IonicPage()
@Component({
  selector: 'page-order-add-document',
  templateUrl: 'order-add-document.html',
})
export class OrderAddDocumentPage extends ProtectedPage {

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
    public toastCtrl: ToastController,
    public authService: AuthService,
    public cameraService: CameraService) {

    super(navCtrl, navParams, storage, authService);

    this.order = navParams.get('order');

    this.customTitle = 'Añadir documento';
  }

  ionViewDidEnter() {
    this.signaturePad.clear();
    this.storage.get('savedSignature').then((data) => {
      this.signature = data;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderAddDocumentPage');
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
    this.storage.set('savedSignature', this.signature);
    this.signaturePad.clear();
    let toast = this.toastCtrl.create({
      message: 'New Signature saved.',
      duration: 3000
    });
    toast.present();
  }

  clearPad() {
    this.signaturePad.clear();
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
        //alert("llega");
        //console.log(picture);
        //this.chosenPicture = picture;
        this.signature = picture;
        this.storage.set('savedSignature', this.signature);
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
        //alert("llega");
        //console.log(picture);
        //this.chosenPicture = picture;
        this.signature = picture;
        this.storage.set('savedSignature', this.signature);
      }
      loading.dismiss();
    }, error => {
      alert(error);
    });
  }

  upload() {
    this.getFromCamera();
    /*let options = {
      quality: 100
    };
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:

      const fileTransfer: FileTransferObject = this.transfer.create();

      let options1: FileUploadOptions = {
        fileKey: 'file',
        fileName: 'name.jpg',
        headers: {}
      }

      fileTransfer.upload(imageData, 'https://localhost/ionic/upload.php', options1)
        .then((data) => {
          // success
          alert("success");
        }, (err) => {
          // error
          alert("error" + JSON.stringify(err));
        });
    });*/
  }

}
