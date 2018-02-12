import { SettingsListPage } from './settings';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    SettingsListPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsListPage),
	TranslateModule.forChild()
  ],
  exports: [
    SettingsListPage
  ]
})

export class SettingsListPageModule { }
