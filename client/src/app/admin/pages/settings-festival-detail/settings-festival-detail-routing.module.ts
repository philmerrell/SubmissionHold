import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsFestivalDetailPage } from './settings-festival-detail.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsFestivalDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsFestivalDetailPageRoutingModule {}
