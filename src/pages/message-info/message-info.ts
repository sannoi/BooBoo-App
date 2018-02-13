import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, MenuController, ModalController, LoadingController} from 'ionic-angular';
import {ProtectedPage} from '../protected-page/protected-page';
import {Storage} from '@ionic/storage';
import {AuthService} from '../../providers/auth-service';
import {MessagesServiceProvider} from '../../providers/messages-service/messages-service';
import { MessageModel } from '../../models/message.model';

@IonicPage()
@Component({
  selector: 'page-message-info',
  templateUrl: 'message-info.html',
})
export class MessageInfoPage extends ProtectedPage {

  loading: any;

  private message: MessageModel;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public modalCtrl: ModalController,
    public storage: Storage,
	public loadingCtr: LoadingController,
	public authService: AuthService,
    public messagesService: MessagesServiceProvider) {
		super(navCtrl, navParams, storage, authService);

		this.message = navParams.get('message');
  }

  ionViewWillEnter() {

	  this.loading = this.loadingCtr.create({content: "Cargando mensaje..."});

	  this.loading.present().then(() => {
		  this.messagesService.getOne(this.message.id).then(updatedMessage => {
			  //console.log(updatedOrder);
			  this.message = updatedMessage;
			  this.loading.dismiss();
		  });
	  });
  }

  ionViewDidLoad() {
  }

  parseTwitterDate(time: string){
		var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
			diff = (((new Date()).getTime() - date.getTime()) / 1000),
			day_diff = Math.floor(diff / 86400);

		if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
			return;

		return day_diff == 0 && (
				diff < 60 && "ahora mismo" ||
				diff < 120 && "hace 1 minuto" ||
				diff < 3600 && "hace " + Math.floor( diff / 60 ) + " minutos" ||
				diff < 7200 && "hace 1 hora" ||
				diff < 86400 && "hace " + Math.floor( diff / 3600 ) + " horas") ||
			day_diff == 1 && "ayer" ||
			day_diff < 7 && "hace " + day_diff + " días" ||
			day_diff < 31 && "hace " + Math.ceil( day_diff / 7 ) + " semanas";
	}

}
