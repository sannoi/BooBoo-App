import { NgModule } from '@angular/core';
import { TextAvatarDirective } from '../directives/text-avatar/text-avatar';
import { SafeHtmlPipe } from "../pipes/safehtml.pipe";
import { SortByPipe } from "../pipes/sort-by/sort-by";
import { SortDescByPipe } from "../pipes/sort-desc-by/sort-desc-by";
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  declarations: [
    TextAvatarDirective,
    SafeHtmlPipe,
    SortByPipe,
    SortDescByPipe
  ],
  imports: [
    SignaturePadModule
  ],
  exports: [
    TextAvatarDirective,
    SafeHtmlPipe,
    SortByPipe,
    SortDescByPipe,
    SignaturePadModule
  ]
})
export class SharedModule { }
