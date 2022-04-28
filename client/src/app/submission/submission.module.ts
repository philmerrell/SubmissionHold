import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubmissionPageRoutingModule } from './submission-routing.module';

import { SubmissionPage } from './submission.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    SubmissionPageRoutingModule
  ],
  declarations: [SubmissionPage]
})
export class SubmissionPageModule {}
