import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SubmissionsPageRoutingModule } from './submissions-routing.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SubmissionsPage } from './submissions.page';
import { SubmissionsLoadingComponent } from './submissions-loading/submissions-loading.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScrollingModule,
    SubmissionsPageRoutingModule
  ],
  declarations: [SubmissionsPage, SubmissionsLoadingComponent ]
})
export class SubmissionsPageModule {}
