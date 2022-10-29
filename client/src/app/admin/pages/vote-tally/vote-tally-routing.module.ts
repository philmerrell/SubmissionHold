import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoteTallyPage } from './vote-tally.page';

const routes: Routes = [
  {
    path: '',
    component: VoteTallyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoteTallyPageRoutingModule {}
