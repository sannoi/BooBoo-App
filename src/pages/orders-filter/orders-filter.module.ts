import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrdersFilterPage } from './orders-filter';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    OrdersFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(OrdersFilterPage),
    TranslateModule.forChild()
  ],
  exports: [
    OrdersFilterPage
  ]
})
export class OrdersFilterPageModule {}
