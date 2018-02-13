import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, LoadingController } from 'ionic-angular';
import {ProtectedPage} from '../protected-page/protected-page';
import {Storage} from '@ionic/storage';
import {AuthService} from '../../providers/auth-service';
import {MessagesServiceProvider} from '../../providers/messages-service/messages-service';
import {MessageModel} from '../../models/message.model';

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage extends ProtectedPage {
	
	public messages: any;

    public customTitle: string;
	
	public pageType: string;
	
	public loading: any;

  constructor(
	public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
	public loadingCtr: LoadingController,
    public storage: Storage,
	public authService: AuthService,
    public messagesService: MessagesServiceProvider) {
	  super(navCtrl, navParams, storage, authService);

      this.customTitle = navParams.get('pageTitle');
	  
	  this.pageType = navParams.get('pageType');
	  if (!this.pageType ||this.pageType == ''){
		  this.pageType = 'entrada';
	  }
  }
  
  ionViewWillEnter() {
	  this.loading = this.loadingCtr.create({content: "Cargando mensajes..."});
	  
	  this.loading.present().then(() => {
		  this.messagesService.getAll(this.pageType).then((messages) => { 
			this.messages = messages;
			this.loading.dismiss();
		  });
	  });
  }
  
  messageInfo(message: MessageModel) {
    this.navCtrl.push('MessageInfoPage', {message: message});
  }
  
  removeHTMLTags(txt: string) {
	  return  txt ? String(txt).replace(/<[^>]+>/gm, '') : '';
  }

  ionViewDidLoad() {
  }

}
