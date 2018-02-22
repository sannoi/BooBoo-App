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
    public translate: TranslateService,
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

    this.configService.getActivePage().subscribe(val => {
      if (val) {
        this.openLink(val);
      }
    });

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
          if (this.configService.cfg.extensions.users.active) {
            this.authService.initializeUser().then(dataUsr => {
              this.initializeExtensions();
            });
          } else {
            this.initializeExtensions();
          }

          this.configPages();
        }
      });
    });
  }

  initializeExtensions() {
    let extensions = this.configService.cfg.extensions;
    let extensionsKeys = Object.keys(extensions);
    for (var i = 0; i < extensionsKeys.length; i++){
      var eKey = extensionsKeys[i];
      var extension = extensions[eKey];
      if (extension && extension.active) {
        var provider = extension.provider;
        if (provider && this[provider]) {
          this[provider].initialize().then(data => {
            this.responseInitExtension(data);
          });
        }
      }
    }
  }

  responseInitExtension(data: any) {
    if (data) {
      if (data.modal && data.modal_buttons) {
        let dataSettings = data.modal;
        dataSettings.buttons = [];
        for (var i = 0; i < data.modal_buttons.length; i++) {
          if (data.modal_buttons[i].role && data.modal_buttons[i].role == 'cancel') {
            let btn = { text: data.modal_buttons[i].text, role: 'cancel', handler: () => {} };
            dataSettings.buttons.push(btn);
          } else if (data.modal_buttons[i].navToMenuLink) {
            let link = this.configService.menu.pages[data.modal_buttons[i].navToMenuLink];
            let btn = { text: data.modal_buttons[i].text, handler: () => { this.openPage(link) } };
            dataSettings.buttons.push(btn);
          }
        }
        console.log(dataSettings);
        this.alert = this.alertCtrl.create(dataSettings);
        this.alert.present();
      }
    }
  }

  redirectPush(data: any) {
    if (this.configService.cfg.extensions.notifications.active && data){
      if (data.wasTapped) {
        let msgPage = { title: 'page.messages', icon: 'chatboxes', extension: 'messages', type: 'list', nav_params: { pageTitle: 'page.messages', pageType: 'all', autoOpenItem: data.msg_parent_id }  };
        this.configService.setActivePage(msgPage);
        //this.openPage(msgPage);
      } else {
        let view = this.nav.getActive();
        if (view.component.name == "MessageInfoPage" && view.data.message.id == data.msg_parent_id) {
          this.nav.push("MessageInfoPage", view.data).then(() => {
            this.nav.remove(1);
          });
        } else if (view.component.name == "MessagesPage") {
          let msgs = { title: 'page.messages', icon: 'chatboxes', extension: 'messages', type: 'list', nav_params: { pageTitle: 'page.messages', pageType: 'all' }  };
          this.configService.setActivePage(msgs);
          //this.openPage(msgs);
        } else {
          this.alert = this.alertCtrl.create({
            enableBackdropDismiss: false,
            title: 'Mensaje nuevo',
            message: 'Has recibido un mensaje. ¿Quieres leerlo?',
            buttons: [
              {
                text: 'No',
                role: 'cancel',
                handler: () => { }
              },
              {
                text: 'Sí',
                handler: () => {
                  let msgPage = { title: 'page.messages', icon: 'chatboxes', extension: 'messages', type: 'list', nav_params: { pageTitle: 'page.messages', pageType: 'all', autoOpenItem: data.msg_parent_id }  };
                  this.configService.setActivePage(msgPage);
                  //this.openPage(msgPage);
                }
              }
            ]
          });
          this.alert.present();
        }
      }
    }
  }

  public configPages() {
    let uType = this.authService.userType;
    let pages = this.configService.menu.pages;
    pages = pages.filter(function(x){
      return (!x.require_user_type || x.require_user_type == uType);
    });

    this.pages = pages;
  }

  openPage(page) {
    this.configService.setActivePage(page);
  }

  openLink(page) {
    page = this.configExtensionPage(page);

    if (page.method && page.method === 'logout') {
      this.loading = this.loadingCtrl.create({
        content: 'Cerrando sesión...'
      });
      this.loading.present();
      this.authService.logout().then(result => {
        this.loading.dismiss();
        this.nav.setRoot(page.component, page.nav_params);
      });
    } else {
      this.nav.setRoot(page.component, page.nav_params);
    }
  }

  configExtensionPage(page: any) {
    if (page.extension && page.type && !page.component) {
      let extension = this.configService.cfg.extensions[page.extension];
      if (extension && extension.active && extension[page.type] && extension[page.type]['use'] && extension[page.type]['component']){
        page.component = extension[page.type]['component'];
      }
      page.nav_params.extension = extension;
    }

    return page;
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
