import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoteTallyPageRoutingModule } from './vote-tally-routing.module';

import { VoteTallyPage } from './vote-tally.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoteTallyPageRoutingModule
  ],
  declarations: [VoteTallyPage]
})
export class VoteTallyPageModule {}
