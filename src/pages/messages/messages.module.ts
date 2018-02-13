import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { MessagesPage } from './messages';

@NgModule({
  declarations: [
    MessagesPage,
  ],
  imports: [
    IonicPageModule.forChild(MessagesPage),
	TranslateModule.forChild()
  ],
  exports: [
    MessagesPage
  ]
})
export class MessagesPageModule {}
