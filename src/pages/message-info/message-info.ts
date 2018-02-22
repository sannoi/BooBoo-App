import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ModalController, AlertController, ToastController, LoadingController, Content } from 'ionic-angular';
import { FormControl, FormBuilder } from '@angular/forms';
import { ProtectedPage } from '../protected-page/protected-page';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';
import { MessagesServiceProvider } from '../../providers/messages-service/messages-service';
import { MessageModel } from '../../models/message.model';

@IonicPage()
@Component({
  selector: 'page-message-info',
  templateUrl: 'message-info.html',
})
export class MessageInfoPage extends ProtectedPage {

  @ViewChild(Content) contenido: Content;

  loading: any;

  content: any;

  usr: any;

  private message: MessageModel;

  public messageForm: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public modalCtrl: ModalController,
    public storage: Storage,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtr: LoadingController,
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public messagesService: MessagesServiceProvider) {
    super(navCtrl, navParams, storage, authService);

    this.message = navParams.get('message');

    this.usr = this.authService.getUsr();

    this.messageForm = formBuilder.group({
      message: new FormControl('')
    });
  }

  ionViewWillEnter() {
    this.contenido.scrollToBottom();
    this.markAsReaded();

    /*this.loading = this.loadingCtr.create({ content: "Cargando mensaje..." });

    this.loading.present().then(() => {*/
      /*this.messagesService.getOne(this.message.id).then(updatedMessage => {
        //console.log(updatedOrder);
        this.message = updatedMessage;
        //this.loading.dismiss();
        this.scrollToBottom();
        this.markAsReaded();
      });*/
    //});
  }

  ionViewDidLoad() {
  }

  userInfo(user: any) {
    this.navCtrl.push('UserInfoPage', {user: user});
  }

  markAsReaded() {
    let data = { token: null, id_item: this.message.id };

    this.authService.getFormToken().then(newFormToken => {
      data.token = newFormToken;
      this.messagesService.markAsReaded(data).then(result => {
        if (result.response == 'error') {
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: result.response_text,
            buttons: ['OK']
          });
          //this.loading.dismiss();
          alert.present();
        } else {
          this.messagesService.getOne(this.message.id).then(updatedMsg => {
            this.message = updatedMsg;
          });
        }
      });
    });
  }

  sendResponse() {
    let data = { token: null, padre: this.message.id, categorias: [1], contenido: this.content, titulo: "Re: " + this.message.titulo_formateado, estado: 1, destinatarios: JSON.parse(this.message.destinatarios) };

    if (data && data.contenido) {
      this.loading = this.loadingCtr.create({ content: "Enviando mensaje..." });
      this.loading.present().then(() => {
        this.authService.getFormToken().then(newFormToken => {
          data.token = newFormToken;
          this.messagesService.sendResponse(data).then(result => {
            if (result.response == 'error') {
              let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: result.response_text,
                buttons: ['OK']
              });
              this.loading.dismiss();
              alert.present();
            } else {
              this.messagesService.getOne(this.message.id).then(updatedMsg => {
                this.message = updatedMsg;
                let toast = this.toastCtrl.create({
                  message: 'Mensaje enviado',
                  duration: 3000,
                  position: 'top'
                });
                toast.present();
                this.loading.dismiss();
                this.scrollToBottom();
                this.content = "";
              });
            }
          });
        });
      });
    }
  }

  parseTwitterDate(time: string) {
    var date = new Date((time || "").replace(/-/g, "/").replace(/[TZ]/g, " ")),
      diff = (((new Date()).getTime() - date.getTime()) / 1000),
      day_diff = Math.floor(diff / 86400);

    if (isNaN(day_diff) || day_diff < 0/* || day_diff >= 31*/)
      return;

    if (day_diff >= 31) {
      var monthNames = [
        "ene", "feb", "mar",
        "abr", "may", "jun", "jul",
        "ago", "sep", "oct",
        "nov", "dic"
      ];

      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();

      return day + ' ' + monthNames[monthIndex] + ' ' + year;
    }


    return day_diff == 0 && (
      diff < 60 && "ahora mismo" ||
      diff < 120 && "hace 1 minuto" ||
      diff < 3600 && "hace " + Math.floor(diff / 60) + " minutos" ||
      diff < 7200 && "hace 1 hora" ||
      diff < 86400 && "hace " + Math.floor(diff / 3600) + " horas") ||
      day_diff == 1 && "ayer" ||
      day_diff < 7 && "hace " + day_diff + " días" ||
      day_diff < 31 && "hace " + Math.ceil(day_diff / 7) + " semanas";
  }

  scrollToBottom() {
    //this.contenido.scrollToBottom();
    setTimeout(() => {
      this.contenido.scrollToBottom();
    }, 100);
  }

}
