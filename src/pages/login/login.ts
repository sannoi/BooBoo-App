import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, MenuController, LoadingController, AlertController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from '../../providers/auth-service';
import {LocationServiceProvider} from '../../providers/location-service';
import { TouchID } from '@ionic-native/touch-id';
import {UserModel} from '../../models/user.model';
import {ConfigServiceProvider} from '../../providers/config-service/config-service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  private loginData: FormGroup;
  public user: UserModel;
  loading: any;
  alert: any;

  constructor(
    private touchId: TouchID,
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public storage: Storage,
    public loadingCtr: LoadingController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public locationService: LocationServiceProvider,
    private configService: ConfigServiceProvider) {

    this.touchId.isAvailable()
      .then(
        res => console.log('TouchID is available!'),
        err => console.error('TouchID is not available', err)
      );

    this.touchId.verifyFingerprint('Scan your fingerprint please')
      .then(
        res => console.log('Ok', res),
        err => console.error('Error', err)
      );


    this.loginData = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });
  }

  ionViewDidLoad() {
    //hide menu when on the login page, regardless of the screen resolution
    this.menuCtrl.enable(false);
  }

  login() {
	  this.loading = this.loadingCtr.create({content: "Conectando..."});

	  this.loading.present().then(() => {
		  //use this.loginData.value to authenticate the user
			this.authService.login(this.loginData.value)
			  .then(resp => {
          if (resp === true) {
  				  this.loading.dismiss();
  				  this.redirectToHome();
            if (parseInt(this.authService.getUsr().nivel_acceso) < parseInt(this.configService.cfg.min_level_access_user)) {
              this.alert = this.alertCtrl.create({
                title: 'Cuenta pendiente de validar',
                message: 'Tu cuenta está pendiente de validar. Si necesitas más información puedes escribirnos a operaciones@booboo.eu',
                buttons: [
                  {
                    text: 'Salir',
                    handler: () => {
                      let logoutPage = { title: 'page.logout', icon: 'exit', component: 'WelcomePage', method: 'logout' };
                      this.openPageObj(logoutPage);
                    }
                  }
                ]
              });
              this.alert.present();
            }
            if (this.configService.cfg.extensions.geolocation.active){
              this.locationService.checkEnableGeolocation().then(res => {
                if (res == true){
                  this.alert = this.alertCtrl.create({
                    enableBackdropDismiss: false,
                    title: 'Geolocalización desactivada',
                    message: 'Es recomendable activar la geolocalización para que todas las características de BooBoo funcionen correctamente. Por favor, accede a Configuración y después activa la opción Geolocalización.',
                    buttons: [
                      {
                        text: 'No, gracias',
                        role: 'cancel',
                        handler: () => {
                        }
                      },
                      {
                        text: 'Ir a Configuración',
                        handler: () => {
                          this.navCtrl.setRoot('SettingsListPage', { pageTitle: 'page.settings' });
                        }
                      }
                    ]
                  });
                  this.alert.present();
                }
              });
            }
          } else {
            let alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: this.authService.lastError,
              buttons: ['OK']
            });
            alert.present();
            this.loading.dismiss();
          }
			  })
			  .catch(e => {
				  this.loading.dismiss();
				  console.log("login error", e);
			  });
	  });

  }

  redirectToHome() {
	this.menuCtrl.enable(true);
    this.navCtrl.setRoot('ProfilePage');
  }

  /**
   * Opens a paage
   *
   * @param page string Page name
   */
  openPage(page: string) {
    this.navCtrl.push(page);
  }

  openPageObj(page) {

    if (page.method && page.method === 'logout') {
      this.loading = this.loadingCtr.create({
        content: 'Cerrando sesión...'
      });
      this.loading.present();
      this.authService.logout().then(result => {
        this.loading.dismiss();
        this.navCtrl.setRoot(page.component, { pageTitle: page.title });
      });
    } else {
      if (page.component === 'ListMasterPage' && page.method && page.method === 'onlyNotAssigned') {
        this.navCtrl.setRoot(page.component, { onlyNotAssigned: true, pageTitle: "page.orders.listNotAssigned" });
      } else if (page.component === 'MessagesPage' && page.method) {
        if (page.auto_item_id) {
          this.navCtrl.setRoot(page.component, { pageTitle: page.title, pageType: page.method, autoOpenItem: page.auto_item_id });
        } else {
          this.navCtrl.setRoot(page.component, { pageTitle: page.title, pageType: page.method });
        }
      } else {
        this.navCtrl.setRoot(page.component, { pageTitle: page.title });
      }
    }
  }
}
