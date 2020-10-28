import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TakePicPage } from './take-pic';

@NgModule({
  declarations: [
    TakePicPage,
  ],
  imports: [
    IonicPageModule.forChild(TakePicPage),
  ],
})
export class TakePicPageModule {}
