import { NgModule } from '@angular/core';
import { TextAvatarDirective } from '../directives/text-avatar/text-avatar';

@NgModule({
    declarations: [
        TextAvatarDirective
    ],

    exports: [
        TextAvatarDirective
    ]
})
export class SharedModule{}
