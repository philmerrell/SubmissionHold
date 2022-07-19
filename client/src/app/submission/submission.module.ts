import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubmissionPageRoutingModule } from './submission-routing.module';

import { SubmissionPage } from './submission.page';
import { MusicFormComponent } from './components/music-form/music-form.component';
import { ComedyFormComponent } from './components/comedy-form/comedy-form.component';
import { AleFormComponent } from './components/ale-form/ale-form.component';

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
    ComedyFormComponent,
    AleFormComponent]
})
export class SubmissionPageModule {}
