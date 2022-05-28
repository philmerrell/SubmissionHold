import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';
import { CreateFestivalModalComponent } from './create-festival-modal/create-festival-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SettingsPageRoutingModule
  ],
  declarations: [SettingsPage, CreateFestivalModalComponent]
})
export class SettingsPageModule {}
