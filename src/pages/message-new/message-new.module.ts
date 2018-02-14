import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageNewPage } from './message-new';
import {TranslateModule} from '@ngx-translate/core';

import { SharedModule } from '../../modules/shared-module';

@NgModule({
  declarations: [
    MessageNewPage,
  ],
  imports: [
    IonicPageModule.forChild(MessageNewPage),
    TranslateModule.forChild(),
    SharedModule
  ],
  exports: [
    MessageNewPage
  ]
})
export class MessageNewPageModule {}
