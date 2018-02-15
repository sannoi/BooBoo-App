import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserInfoPage } from './user-info';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../modules/shared-module';

@NgModule({
  declarations: [
    UserInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(UserInfoPage),
    TranslateModule.forChild(),
    SharedModule
  ],
  exports: [
    UserInfoPage
  ]
})
export class UserInfoPageModule { }
