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

}
