import { NgModule } from '@angular/core';
import { TextAvatarDirective } from '../directives/text-avatar/text-avatar';
import {SafeHtmlPipe} from "../pipes/safehtml.pipe";

@NgModule({
    declarations: [
        TextAvatarDirective,
        SafeHtmlPipe
    ],

    exports: [
        TextAvatarDirective,
        SafeHtmlPipe
    ]
})
export class SharedModule{}
