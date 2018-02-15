import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderAddDocumentPage } from './order-add-document';

@NgModule({
  declarations: [
    OrderAddDocumentPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderAddDocumentPage),
    TranslateModule.forChild()
  ],
  exports: [
    OrderAddDocumentPage
  ]
})
export class OrderAddDocumentPageModule {}
