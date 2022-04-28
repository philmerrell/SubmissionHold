import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubmissionDetailPage } from './submission-detail.page';

const routes: Routes = [
  {
    path: '',
    component: SubmissionDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubmissionDetailPageRoutingModule {}
