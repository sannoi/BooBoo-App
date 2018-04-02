import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderNewPage } from './order-new';

@NgModule({
  declarations: [
    OrderNewPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderNewPage),
  ],
  exports: [
    OrderNewPage
  ]
})
export class OrderNewPageModule {}
