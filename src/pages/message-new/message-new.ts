import { Component, ViewChild } from '@angular/core';
import {IonicPage, NavController, NavParams, MenuController, AlertController, ToastController, LoadingController, Content} from 'ionic-angular';
import {ProtectedPage} from '../protected-page/protected-page';
import {Storage} from '@ionic/storage';
import {AuthService} from '../../providers/auth-service';
import {MessagesServiceProvider} from '../../providers/messages-service/messages-service';

@IonicPage()
@Component({
  selector: 'page-message-new',
  templateUrl: 'message-new.html',
})
export class MessageNewPage extends ProtectedPage {

  @ViewChild(Content) contenido: Content;

  public destinatario: any;

  public customTitle: string;

  content: any;

  loading: any;

  message: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public alertCtrl: AlertController,
	  public toastCtrl: ToastController,
	  public loadingCtr: LoadingController,
    public storage: Storage,
	  public authService: AuthService,
    public messagesService: MessagesServiceProvider) {
      super(navCtrl, navParams, storage, authService);

      this.customTitle = navParams.get('pageTitle');

      this.destinatario = navParams.get('destinatario');
  }

  ionViewDidLoad() {
  }

  userInfo(user: any) {
    this.navCtrl.push('UserInfoPage', {user: user});
  }

  sendResponse() {
      let data = { token: null, padre: '0', categorias: [1], contenido: this.content, titulo: this.customTitle, estado: 1, destinatarios: ['-'+this.destinatario.id], alias: this.makeid() };
      if (this.message){
        data.padre = this.message.id;
        data.destinatarios = JSON.parse(this.message.destinatarios);
        if (this.message.propietario != '-' + this.authService.getUsr().id){
          data.destinatarios.push(this.message.propietario);
        }
        data.titulo = "Re: " + this.message.titulo_formateado;
      }

		  if (data && data.contenido){
			  this.loading = this.loadingCtr.create({content: "Enviando mensaje..."});
			  this.loading.present().then(() => {
          this.authService.getFormToken().then(newFormToken => {
            data.token = newFormToken;
            this.messagesService.sendResponse(data).then(result => {
    					if (result.response == 'error'){
    						let alert = this.alertCtrl.create({
    						  title: 'Error',
    						  subTitle: result.response_text,
    						  buttons: ['OK']
    						});
    						this.loading.dismiss();
    						alert.present();
    					} else {
                let idMsg = result.data.id;
                if (this.message){
                  idMsg = this.message.id;
                }
    						this.messagesService.getOne(idMsg).then(updatedMsg => {
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
                  //this.navCtrl.setRoot('MessagesPage', {viewMessage: updatedMsg, pageTitle: 'pages.messages'});
    						});
    					}
  				  });
          });
			  });
		  }
  }

  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

    for (var i = 0; i < 16; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
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
    setTimeout(() => {
      this.contenido.scrollToBottom();
    }, 100);
  }

}
