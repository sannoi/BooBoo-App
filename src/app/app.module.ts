import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { HttpModule, Http } from '@angular/http';
import { AuthHttp, AuthConfig, JwtHelper } from 'angular2-jwt';
import { Storage } from '@ionic/storage';
import { AuthService } from '../providers/auth-service';
import { Geolocation } from '@ionic-native/geolocation';
import { OrdersService } from '../providers/orders-service';
import { UsersService } from '../providers/users-service';
import { CameraService } from '../providers/camera-service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FCM } from '@ionic-native/fcm';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

import { SharedModule } from '../modules/shared-module';
import { TouchID } from '@ionic-native/touch-id';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocationServiceProvider } from '../providers/location-service';
import { MessagesServiceProvider } from '../providers/messages-service/messages-service';
import { ConfigServiceProvider } from '../providers/config-service/config-service';
import { NotificationsServiceProvider } from '../providers/notifications-service/notifications-service';

let storage = new Storage({
  name: '__boobooApp'
});
export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    noJwtError: true,
    globalHeaders: [{ 'Accept': 'application/json' }],
    tokenGetter: (() => storage.get('id_token')),
  }), http);
}

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__boobooApp'
    }),
    HttpModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    JwtHelper,
    TouchID,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
    },
    AuthService,
    OrdersService,
    UsersService,
    LocationServiceProvider,
    Geolocation,
    LaunchNavigator,
    MessagesServiceProvider,
    CameraService,
    Camera,
    FileTransfer,
    FCM,
    ConfigServiceProvider,
    NotificationsServiceProvider
  ]
})
export class AppModule { }
