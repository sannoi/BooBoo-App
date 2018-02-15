import { NgModule } from '@angular/core';
import { TextAvatarDirective } from '../directives/text-avatar/text-avatar';
import {SafeHtmlPipe} from "../pipes/safehtml.pipe";
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
    declarations: [
        TextAvatarDirective,
        SafeHtmlPipe
    ],
    imports: [
      SignaturePadModule
    ],
    exports: [
        TextAvatarDirective,
        SafeHtmlPipe,
        SignaturePadModule
    ]
})
export class SharedModule{}
