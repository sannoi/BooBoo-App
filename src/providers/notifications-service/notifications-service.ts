import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/Rx';
import { ConfigServiceProvider } from '../config-service/config-service';
import { AuthService } from '../auth-service';
import { UsersService } from '../users-service';
import { FCM } from '@ionic-native/fcm';

@Injectable()
export class NotificationsServiceProvider {

  private notification: BehaviorSubject<any>;

  constructor(
    private platform: Platform,
    private configService: ConfigServiceProvider,
    private authService: AuthService,
    private usersService: UsersService,
    private fcm: FCM) {
      this.notification = new BehaviorSubject(null);
    }

    public initialize() {
      this.checkNotifications();

      return new Promise<boolean>((resolve, reject) => {
        resolve(false);
      });
    }

    private checkNotifications() {
      if (this.configService.getAppSetting("notifications") == "on") {
        this.enableNotifications();
      } else {
        this.disableNotifications();
      }
    }

    public enableNotifications() {
      console.log("notifications on");
      if (/*this.platform.is('ios') || */this.platform.is('android')) {
        this.fcm.subscribeToTopic('all');
        this.fcm.getToken().then(token => {
          this.usersService.saveFirebaseDeviceToken(token).then(result => {
            this.authService.firebaseToken = token;
          });
        });
        this.fcm.onNotification().subscribe(data => {
          if (data.msg_parent_id) {
            this.setActiveNotification(data);
          }
        });
        this.fcm.onTokenRefresh().subscribe(token => {
          this.usersService.saveFirebaseDeviceToken(token).then(result => {
            this.authService.firebaseToken = token;
          });
        });
      }
    }

    public disableNotifications() {
      console.log("notifications off");
      if (/*this.platform.is('ios') || */this.platform.is('android')) {
        this.fcm.unsubscribeFromTopic('all').then(result => {
          this.usersService.clearFirebaseDeviceToken().then(result => {
            this.authService.firebaseToken = null;
          });
        });
      }
    }

    public setActiveNotification(val) {
      this.notification.next(val);
    }

    public getActiveNotification() {
      return this.notification.asObservable();
    }
}
