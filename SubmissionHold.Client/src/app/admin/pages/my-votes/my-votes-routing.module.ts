import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyVotesPage } from './my-votes.page';

const routes: Routes = [
  {
    path: '',
    component: MyVotesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyVotesPageRoutingModule {}
