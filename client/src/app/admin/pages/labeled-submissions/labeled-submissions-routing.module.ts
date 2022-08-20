import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LabeledSubmissionsPage } from './labeled-submissions.page';

const routes: Routes = [
  {
    path: '',
    component: LabeledSubmissionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabeledSubmissionsPageRoutingModule {}
