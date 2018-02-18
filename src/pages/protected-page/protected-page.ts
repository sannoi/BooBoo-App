import {NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {AuthService} from '../../providers/auth-service';

export class ProtectedPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
	public authService: AuthService) {
  }

  ionViewCanEnter() {

    this.storage.get('id_token').then(id_token => {
      if (id_token === null) {
        this.navCtrl.setRoot('WelcomePage');
        return false;
      } else {
        return true;
      }
    });
  }

  isUserProvider() {
	  if (this.authService.userType == 'proveedor'){
		  return true;
	  } else {
		  return false;
	  }
  }

  isUserDriver() {
	  if (this.authService.userType == 'conductor'){
		  return true;
	  } else {
		  return false;
	  }
  }

  isUserCustomer() {
	  if (this.authService.userType == 'cliente'){
		  return true;
	  } else {
		  return false;
	  }
  }
}
