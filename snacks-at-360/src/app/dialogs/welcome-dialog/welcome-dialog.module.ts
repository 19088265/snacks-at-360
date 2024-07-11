import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcomeDialogPageRoutingModule } from './welcome-dialog-routing.module';

import { WelcomeDialogPage } from './welcome-dialog.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcomeDialogPageRoutingModule
  ],
  declarations: [WelcomeDialogPage]
})
export class WelcomeDialogPageModule {}
