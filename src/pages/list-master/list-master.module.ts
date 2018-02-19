import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { SharedModule } from '../../modules/shared-module';

import { ListMasterPage } from './list-master';

@NgModule({
  declarations: [
    ListMasterPage,
  ],
  imports: [
    IonicPageModule.forChild(ListMasterPage),
    TranslateModule.forChild(),
    SharedModule
  ],
  exports: [
    ListMasterPage
  ]
})
export class ListMasterPageModule { }
