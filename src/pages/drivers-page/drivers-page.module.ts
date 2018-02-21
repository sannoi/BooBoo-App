import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { SharedModule } from '../../modules/shared-module';
import { DriversPage } from './drivers-page';

@NgModule({
  declarations: [
    DriversPage,
  ],
  imports: [
    IonicPageModule.forChild(DriversPage),
    TranslateModule.forChild(),
    SharedModule
  ],
  exports: [
    DriversPage
  ]
})
export class DriversPageModule { }
