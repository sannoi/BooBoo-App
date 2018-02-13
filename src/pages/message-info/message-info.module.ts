import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageInfoPage } from './message-info';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    MessageInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(MessageInfoPage),
	TranslateModule.forChild()
  ],
  exports: [
    MessageInfoPage
  ]
})
export class MessageInfoPageModule {}
