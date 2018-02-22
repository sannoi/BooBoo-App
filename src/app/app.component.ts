import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { ConfigServiceProvider } from '../providers/config-service/config-service';
import { AuthService } from '../providers/auth-service';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '../providers/users-service';
import { LocationServiceProvider } from '../providers/location-service';
import { MessagesServiceProvider } from '../providers/messages-service/messages-service';
import { NotificationsServiceProvider } from '../providers/notifications-service/notifications-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'WelcomePage';

  pages: Array<{ title: string, icon?: string, component: any, method?: any }>;

  selectedTheme: string;

  selectedUser: any;

  loading: any;

  alert: any;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public splashScreen: SplashScreen,
    public authService: AuthService,
    public storage: Storage,
    public configService: ConfigServiceProvider,
    public messagesService: MessagesServiceProvider,
    translate: TranslateService,
    public locationService: LocationServiceProvider,
    public usersService: UsersService,
    public notificationsService: NotificationsServiceProvider) {
    this.authService.getUsrAsObservable().subscribe(val => {
      this.selectedUser = val;
      if (val) {
        this.configPages();
      }
    });

    this.configService.getActiveTheme().subscribe(val => this.selectedTheme = val);

    this.notificationsService.getActiveNotification().subscribe(val => this.redirectPush(val));

    this.initializeApp();

    translate.setDefaultLang('es');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.configService.initialize().then(res => {
        if (res) {
          if (this.configService.cfg.extensions_active.users) {
            this.authService.initializeUser().then(usr => {
              if (usr && usr.nivel_acceso && this.configService.cfg.min_level_access_user) {
                if (parseInt(usr.nivel_acceso) < parseInt(this.configService.cfg.min_level_access_user)) {
                  this.alert = this.alertCtrl.create({
                    enableBackdropDismiss: false,
                    title: 'Cuenta pendiente de validar',
                    message: 'Tu cuenta está pendiente de validar. Si necesitas más información puedes escribirnos a operaciones@booboo.eu',
                    buttons: [
                      {
                        text: 'Salir',
                        handler: () => {
                          let logoutPage = { title: 'page.logout', icon: 'exit', component: 'WelcomePage', method: 'logout' };
                          this.openPage(logoutPage);
                        }
                      }
                    ]
                  });
                  this.alert.present();
                }
              }
            });
          }
          if (this.configService.cfg.extensions_active.notifications) {
            this.notificationsService.startupNotifications();
          }
          if (this.configService.cfg.extensions_active.geolocation) {
            this.locationService.refreshGeolocation();
            this.authService.startupCheckGeolocation();
            this.locationService.checkEnableGeolocation().then(res => {
              if (res == true) {
                this.alert = this.alertCtrl.create({
                  enableBackdropDismiss: false,
                  title: 'Geolocalización desactivada',
                  message: 'Es recomendable activar la geolocalización para que todas las características de BooBoo funcionen correctamente. Por favor, accede a Configuración y después activa la opción Geolocalización.',
                  buttons: [
                    {
                      text: 'No, gracias',
                      role: 'cancel',
                      handler: () => { }
                    },
                    {
                      text: 'Ir a Configuración',
                      handler: () => {
                        this.nav.setRoot('SettingsListPage', { pageTitle: 'page.settings' });
                      }
                    }
                  ]
                });
                this.alert.present();
              }
            });
          }
          this.configPages();
        }
      });
    });
  }

  redirectPush(data: any) {
    if (this.configService.cfg.extensions_active.notifications && data){
      if (data.wasTapped) {
        let msgPage = { title: 'page.messages', icon: 'chatboxes', component: 'MessagesPage', method: 'all', auto_item_id: data.msg_parent_id };
        this.openPage(msgPage);
      } else {
        let view = this.nav.getActive();
        if (view.component.name == "MessageInfoPage" && view.data.message.id == data.msg_parent_id) {
          this.nav.push("MessageInfoPage", view.data).then(() => {
            this.nav.remove(1);
          });
        } else if (view.component.name == "MessagesPage") {
          let msgs = { title: 'page.messages', icon: 'chatboxes', component: 'MessagesPage', method: 'all' };
          this.openPage(msgs);
        } else {
          alert("Notificacion local de mensaje: " + data.msg_parent_id);
          let msgPage = { title: 'page.messages', icon: 'chatboxes', component: 'MessagesPage', method: 'all', auto_item_id: data.msg_parent_id };
          this.openPage(msgPage);
        }
      }
    }
  }

  public configPages() {
    this.storage.get("userType").then((uType) => {
      if (uType == 'proveedor') {
        this.pages = [
          { title: 'page.profile', icon: 'desktop', component: 'ProfilePage' },
          { title: 'page.orders.list', icon: 'cube', component: 'ListMasterPage' },
          { title: 'page.orders.listNotAssigned', icon: 'share-alt', component: 'ListMasterPage', method: 'onlyNotAssigned' },
          { title: 'page.messages', icon: 'chatboxes', component: 'MessagesPage', method: 'all' },
          { title: 'page.map', icon: 'map', component: 'MapPage' },
          { title: 'page.settings', icon: 'cog', component: 'SettingsListPage' },
          { title: 'page.logout', icon: 'exit', component: 'WelcomePage', method: 'logout' }
        ];
      } else {
        this.pages = [
          { title: 'page.profile', icon: 'desktop', component: 'ProfilePage' },
          { title: 'page.orders.list', icon: 'cube', component: 'ListMasterPage' },
          { title: 'page.messages', icon: 'chatboxes', component: 'MessagesPage', method: 'all' },
          { title: 'page.map', icon: 'map', component: 'MapPage' },
          { title: 'page.settings', icon: 'cog', component: 'SettingsListPage' },
          { title: 'page.logout', icon: 'exit', component: 'WelcomePage', method: 'logout' }
        ];
      }
    });
  }

  openPage(page) {

    if (page.method && page.method === 'logout') {
      this.loading = this.loadingCtrl.create({
        content: 'Cerrando sesión...'
      });
      this.loading.present();
      this.authService.logout().then(result => {
        this.loading.dismiss();
        this.nav.setRoot(page.component, { pageTitle: page.title });
      });
    } else {
      if (page.component === 'ListMasterPage' && page.method && page.method === 'onlyNotAssigned') {
        this.nav.setRoot(page.component, { onlyNotAssigned: true, pageTitle: "page.orders.listNotAssigned" });
      } else if (page.component === 'MessagesPage' && page.method) {
        if (page.auto_item_id) {
          this.nav.setRoot(page.component, { pageTitle: page.title, pageType: page.method, autoOpenItem: page.auto_item_id });
        } else {
          this.nav.setRoot(page.component, { pageTitle: page.title, pageType: page.method });
        }
      } else {
        this.nav.setRoot(page.component, { pageTitle: page.title });
      }
    }
  }

  isUserProvider() {
    if (this.authService.userType == 'proveedor') {
      return true;
    } else {
      return false;
    }
  }

  isUserDriver() {
    if (this.authService.userType == 'conductor') {
      return true;
    } else {
      return false;
    }
  }

  isUserCustomer() {
    if (this.authService.userType == 'cliente') {
      return true;
    } else {
      return false;
    }
  }
}
