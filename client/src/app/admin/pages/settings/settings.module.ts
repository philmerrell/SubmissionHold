import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';
import { ComposeFestivalModalModule } from '../../shared/compose-festival-modal/compose-festival-modal.module';

@NgModule({
  imports: [
    CommonModule,
    ComposeFestivalModalModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SettingsPageRoutingModule
  ],
  declarations: [SettingsPage ]
})
export class SettingsPageModule {}
