import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderNotesPage } from './order-notes-page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        OrderNotesPage,
    ],
    imports: [
        IonicPageModule.forChild(OrderNotesPage),
        TranslateModule.forChild()
    ],
    exports: [
        OrderNotesPage
    ]
})
export class OrderNotesPageModule { }
