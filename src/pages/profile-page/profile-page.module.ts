import { ProfilePage } from './profile-page';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
  ],
  exports: [
    ProfilePage
  ]
})

export class ProfilePageModule { }
