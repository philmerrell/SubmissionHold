import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ComposeFestivalModalComponent } from './compose-festival-modal.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ ComposeFestivalModalComponent ],
  exports: [ ComposeFestivalModalComponent ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class ComposeFestivalModalModule { }
