import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrdersCalendarPage } from './orders-calendar';
import { SharedModule } from '../../modules/shared-module';

@NgModule({
  declarations: [
    OrdersCalendarPage,
  ],
  imports: [
    IonicPageModule.forChild(OrdersCalendarPage),
    SharedModule
  ],
  exports: [
    OrdersCalendarPage
  ]
})
export class OrdersCalendarPageModule {}
