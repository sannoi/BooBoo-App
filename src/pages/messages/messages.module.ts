import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { TextAvatarDirective } from '../../directives/text-avatar/text-avatar';

import { MessagesPage } from './messages';

@NgModule({
  declarations: [
    MessagesPage,
	TextAvatarDirective,
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
