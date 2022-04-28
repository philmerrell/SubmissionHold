import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubmissionDetailPageRoutingModule } from './submission-detail-routing.module';

import { SubmissionDetailPage } from './submission-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubmissionDetailPageRoutingModule
  ],
  declarations: [SubmissionDetailPage]
})
export class SubmissionDetailPageModule {}
