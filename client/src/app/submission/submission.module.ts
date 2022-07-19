import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubmissionPageRoutingModule } from './submission-routing.module';

import { SubmissionPage } from './submission.page';
import { MusicFormComponent } from './components/music-form/music-form.component';
import { GeneralFortFormComponent } from './components/general-fort-form/general-fort-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    SubmissionPageRoutingModule
  ],
  declarations: [
    SubmissionPage,
    MusicFormComponent,
    GeneralFortFormComponent]
})
export class SubmissionPageModule {}
