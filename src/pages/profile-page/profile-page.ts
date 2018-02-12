import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, MenuController, ModalController} from 'ionic-angular';
import {ProtectedPage} from '../protected-page/protected-page';
import {Storage} from '@ionic/storage';
import {AuthService} from '../../providers/auth-service';

@IonicPage()
@Component({
  selector: 'page-profile-page',
  templateUrl: 'profile-page.html'
})
export class ProfilePage extends ProtectedPage {

  public following: boolean = false;
    
  public user: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public modalCtrl: ModalController,
    public storage: Storage,
	public authService: AuthService) {
		super(navCtrl, navParams, storage, authService);
	}

  ionViewDidLoad() {
	this.menuCtrl.enable(true);
	this.storage.get('user').then(usr => {
        this.user = usr;
    });
  }
  
  openPage(component, title, method) {
	if (component === 'ListMasterPage' && method && method === 'onlyNotAssigned') {
        this.navCtrl.setRoot(component, { onlyNotAssigned: true, pageTitle: "page.orders.listNotAssigned" });
    } else {
        this.navCtrl.setRoot(component, { pageTitle: title });
    }
  }

  follow() {
    this.following = !this.following;
    console.log('Follow user clicked');
  }

  imageTapped(post) {
    console.log('Post image clicked');
  }

  comment(post) {
    console.log('Comments clicked');
  }

  like(post) {
    console.log('Like clicked');
  }

}
