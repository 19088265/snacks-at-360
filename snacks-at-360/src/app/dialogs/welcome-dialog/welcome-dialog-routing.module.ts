import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeDialogPage } from './welcome-dialog.page';

const routes: Routes = [
  {
    path: '',
    component: WelcomeDialogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeDialogPageRoutingModule {}
