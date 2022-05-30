import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsFestivalDetailPageRoutingModule } from './settings-festival-detail-routing.module';

import { SettingsFestivalDetailPage } from './settings-festival-detail.page';
import { ComposeFestivalModalModule } from '../../shared/compose-festival-modal/compose-festival-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComposeFestivalModalModule,
    IonicModule,
    SettingsFestivalDetailPageRoutingModule
  ],
  declarations: [SettingsFestivalDetailPage]
})
export class SettingsFestivalDetailPageModule {}
