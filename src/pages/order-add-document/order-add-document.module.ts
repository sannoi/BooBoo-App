import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderAddDocumentPage } from './order-add-document';
import { SharedModule } from '../../modules/shared-module';

@NgModule({
  declarations: [
    OrderAddDocumentPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderAddDocumentPage),
    TranslateModule.forChild(),
    SharedModule
  ],
  exports: [
    OrderAddDocumentPage
  ]
})
export class OrderAddDocumentPageModule {}
