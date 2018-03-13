import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LegalPage } from './legal';

@NgModule({
  declarations: [
    LegalPage,
  ],
  imports: [
    IonicPageModule.forChild(LegalPage),
  ],
  exports: [
    LegalPage
  ]
})
export class LegalPageModule {}
