import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { AuthService } from '../providers/auth-service';
import { TranslateService } from '@ngx-translate/core';
import { LocationServiceProvider } from '../providers/location-service';

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
    translate: TranslateService,
    locationService: LocationServiceProvider) {

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

      this.configPages();
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
      this.nav.setRoot(page.component, { pageTitle: page.title, pageType: page.method });
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
