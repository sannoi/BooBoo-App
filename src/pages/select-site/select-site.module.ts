import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectSitePage } from './select-site';

@NgModule({
  declarations: [
    SelectSitePage,
  ],
  imports: [
    IonicPageModule.forChild(SelectSitePage),
    TranslateModule.forChild()
  ],
  exports: [
    SelectSitePage
  ]
})
export class SelectSitePageModule {}
