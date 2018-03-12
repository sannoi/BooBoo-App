import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { HelpPage } from './help';

@NgModule({
  declarations: [
    HelpPage,
  ],
  imports: [
    IonicPageModule.forChild(HelpPage),
    TranslateModule.forChild()
  ],
  exports: [
    HelpPage
  ]
})
export class HelpPageModule {}
