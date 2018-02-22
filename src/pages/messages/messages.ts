import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { ProtectedPage } from '../protected-page/protected-page';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';
import { MessagesServiceProvider } from '../../providers/messages-service/messages-service';
import { MessageModel } from '../../models/message.model';

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage extends ProtectedPage {

  public messages: any;

  public autoOpenItem: any;

  public customTitle: string;

  public pageType: string;

  public loading: any;

  public dataLoaded: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public loadingCtr: LoadingController,
    public modalCtrl: ModalController,
    public storage: Storage,
    public authService: AuthService,
    public messagesService: MessagesServiceProvider) {
    super(navCtrl, navParams, storage, authService);

    this.dataLoaded = false;

    let extension = navParams.get('extension');
    console.log(extension);

    this.customTitle = navParams.get('pageTitle');

    this.autoOpenItem = navParams.get('autoOpenItem');

    this.pageType = navParams.get('pageType');
    if (!this.pageType || this.pageType == '') {
      this.pageType = 'entrada';
    }

    this.loadMessages();
  }

  loadMessages() {
    let aoi = this.autoOpenItem;
    if (aoi) {
      this.autoOpenItem = null;
    }
    this.messagesService.getAll(this.pageType).then((messages) => {
      this.messages = messages;

      this.dataLoaded = true;

      if (aoi) {
        let msg = this.messages.find(function(x) {
          return x.id == aoi;
        });

        if (msg) {
          this.messageInfo(msg);
        } else {
          alert(JSON.stringify(msg));
        }
      } else {
        //this.loading.dismiss();
      }
    });
  }

  ionViewWillEnter() {
    this.loadMessages();
  }

  ionViewDidLoad() {
  }

  newMessage() {
    let modal = this.modalCtrl.create('DriversPage', { pageTitle: 'page.users', listType: 'owner' });
    modal.present();

    modal.onDidDismiss(data => {
      if (data && data.driver) {
        this.messagesService.getUserChat(data.driver.id).then(chatResp => {
          if (chatResp && chatResp.length == 1) {
            this.messageInfo(chatResp[0]);
          } else {
            this.navCtrl.push('MessageNewPage', { destinatario: data.driver, pageTitle: data.driver.nombre });
          }
        });
      }
    });
  }

  messageInfo(message: MessageModel) {
    this.navCtrl.push('MessageInfoPage', { message: message });
  }

  removeHTMLTags(txt: string) {
    return txt ? String(txt).replace(/<[^>]+>/gm, '') : '';
  }

  hasResponsesNotReaded(message: MessageModel) {
    if (this.countResponsesNotReaded(message) > 0) {
      return true;
    } else {
      return false;
    }
  }

  countResponsesNotReaded(message: MessageModel) {
    var count = 0;
    if (message.leido == '0' && this.authService && this.authService.getUsr() && this.authService.getUsr().id && message.propietario != '-' + this.authService.getUsr().id) {
      count = 1;
    }
    if (message.respuestas && message.respuestas.length > 0 && this.authService && this.authService.getUsr() && this.authService.getUsr().id) {
      var respuestasSinLeer = message.respuestas.filter(function(x) {
        return (x.leido == '0');
      });
      count += respuestasSinLeer.length;
    }

    return count;
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

}
