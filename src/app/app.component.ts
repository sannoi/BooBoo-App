import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { AuthService } from '../providers/auth-service';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '../providers/users-service';
import { LocationServiceProvider } from '../providers/location-service';
import { MessagesServiceProvider } from '../providers/messages-service/messages-service';
import { FCM } from '@ionic-native/fcm';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'WelcomePage';

  pages: Array<{ title: string, icon?: string, component: any, method?: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public authService: AuthService,
    public storage: Storage,
    public messagesService: MessagesServiceProvider,
    translate: TranslateService,
    locationService: LocationServiceProvider,
    public usersService: UsersService,
    private fcm: FCM) {

    this.initializeApp();

    translate.setDefaultLang('es');

    locationService.refreshGeolocation();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //this.authService.startupTokenRefresh();
      this.authService.startupCheckGeolocation();

      this.checkNotifications();
      this.configPages();
    });
  }

  private checkNotifications() {
    this.fcm.subscribeToTopic('all');
    this.fcm.getToken().then(token => {
      this.usersService.saveFirebaseDeviceToken(token).then(result => {
        //alert('Token de dispositivo guardado: ' + result.response_text + ' ' + token);
      });
      // backend.registerToken(token);
    });
    this.fcm.onNotification().subscribe(data => {
      if (data.msg_parent_id) {
        let msgPage = { title: 'page.messages', icon: 'chatboxes', component: 'MessagesPage', method: 'all', auto_item_id: data.msg_parent_id };
        this.openPage(msgPage);
      }
    });
    this.fcm.onTokenRefresh().subscribe(token => {
      this.usersService.saveFirebaseDeviceToken(token).then(result => {
        //alert('Token de dispositivo guardado: ' + result.response_text + ' ' + token);
      });
      // backend.registerToken(token);
    });
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
      this.authService.logout();
    }
    if (page.component === 'ListMasterPage' && page.method && page.method === 'onlyNotAssigned') {
      this.nav.setRoot(page.component, { onlyNotAssigned: true, pageTitle: "page.orders.listNotAssigned" });
    } else if (page.component === 'MessagesPage' && page.method) {
      if (page.auto_item_id){
        this.nav.setRoot(page.component, { pageTitle: page.title, pageType: page.method, autoOpenItem: page.auto_item_id });
      } else {
        this.nav.setRoot(page.component, { pageTitle: page.title, pageType: page.method });
      }
    } else {
      this.nav.setRoot(page.component, { pageTitle: page.title });
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
