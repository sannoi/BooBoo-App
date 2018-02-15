import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { DrawSignaturePage } from './draw-signature';
import { SharedModule } from '../../modules/shared-module';

@NgModule({
  declarations: [
    DrawSignaturePage,
  ],
  imports: [
    IonicPageModule.forChild(DrawSignaturePage),
    TranslateModule.forChild(),
    SharedModule
  ],
  exports: [
    DrawSignaturePage
  ]
})
export class DrawSignaturePageModule {}
