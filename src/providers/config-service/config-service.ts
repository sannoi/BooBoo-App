import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AuthHttp } from 'angular2-jwt';
import { BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import *  as AppConfig from '../../app/config';
import *  as AppMenu from '../../app/menu';

@Injectable()
export class ConfigServiceProvider {
  public cfg: any;
  public remoteCfg: any;
  public menu: any;
  public currentSite: any;

  public appSettings: any;

  private theme: BehaviorSubject<string>;

  private currentPage: BehaviorSubject<any>;

  constructor(
    private storage: Storage,
    private http: Http,
    private authHttp: AuthHttp) {
    this.cfg = AppConfig.cfg;
    this.appSettings = this.cfg.config_settings;
    this.menu = AppMenu.menu;
    this.theme = new BehaviorSubject('blue-theme');
    this.currentPage = new BehaviorSubject(null);
  }

  loadConfig() {
    return this.http.get(this.apiUrl() + this.cfg.configUrl)
      .toPromise()
      .then(data => {
        this.remoteCfg = data.json().data;
        this.storage.set("config", data.json().data);
      })
      .catch(e => alert(JSON.stringify(e)));
  }

  public initialize() {
    return this.storage.get("site_id").then(site_idx => {
      let idx = site_idx;
      if (!idx) {
        idx = 0;
        this.storage.set("site_id", idx);
      }
      this.currentSite = this.cfg.sites[idx];
      if (this.currentSite) {
        this.setActiveTheme(this.currentSite.theme);
        return this.storage.get("config").then(config => {
          this.remoteCfg = config;
          if (!this.remoteCfg) {
            this.loadConfig();
          }
          return this.storage.get("config_settings").then(settings => {
            if (!settings){
              this.appSettings = this.cfg.config_settings;
              this.storage.set("config_settings", this.cfg.config_settings);
            } else {
              this.appSettings = settings.app;
            }
            return true;
          });
        });
      } else {
        return false;
      }
    });
  }

  public changeSite(site: any) {
    let idx_selected = this.cfg.sites.findIndex(function(x) {
      return x.name == site.name;
    });

    return this.storage.get("site_id").then(site_idx => {
      let idx = site_idx;
      if (idx_selected != -1 && idx != idx_selected) {
        idx = idx_selected;
        this.storage.set("site_id", idx);
      } else {
        return false;
      }
      this.currentSite = this.cfg.sites[idx];
      if (this.currentSite) {
        this.setActiveTheme(this.currentSite.theme);
        return this.storage.get("config").then(config => {
          this.loadConfig();
          return true;
        });
      } else {
        return false;
      }
    });
  }

  public setActiveTheme(val) {
    this.theme.next(val);
  }

  public getActiveTheme() {
    return this.theme.asObservable();
  }

  public setActivePage(val) {
    this.currentPage.next(val);
  }

  public getActivePage() {
    return this.currentPage.asObservable();
  }

  public getAppSetting(setting: any) {
    return this.appSettings[setting];
  }

  public setAppSetting(setting: any, value: any) {
    this.appSettings[setting] = value;
    return this.saveSettings();
  }

  private saveSettings() {
    let settings = { app: this.appSettings };
    return this.storage.set("config_settings", settings).then(options => {
      return options;
    });
  }

  public baseUrl() {
    return this.currentSite.baseUrl;
  }

  public apiUrl() {
    return this.currentSite.apiUrl;
  }

}
