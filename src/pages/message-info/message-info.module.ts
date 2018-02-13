import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageInfoPage } from './message-info';
import {TranslateModule} from '@ngx-translate/core';

import { SharedModule } from '../../modules/shared-module';

@NgModule({
  declarations: [
    MessageInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(MessageInfoPage),
  	TranslateModule.forChild(),
    SharedModule
  ],
  exports: [
    MessageInfoPage
  ]
})
export class MessageInfoPageModule {}
