import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LabeledSubmissionsPageRoutingModule } from './labeled-submissions-routing.module';

import { LabeledSubmissionsPage } from './labeled-submissions.page';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SubmissionsLoadingComponent } from './submissions-loading/submissions-loading.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScrollingModule,
    LabeledSubmissionsPageRoutingModule
  ],
  declarations: [LabeledSubmissionsPage, SubmissionsLoadingComponent]
})
export class LabeledSubmissionsPageModule {}
