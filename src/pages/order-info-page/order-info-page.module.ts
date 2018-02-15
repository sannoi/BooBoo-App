import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderInfoPage } from './order-info-page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    OrderInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderInfoPage),
    TranslateModule.forChild()
  ],
  exports: [
    OrderInfoPage
  ]
})
export class OrderInfoPageModule { }
