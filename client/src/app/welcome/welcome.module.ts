import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcomePageRoutingModule } from './welcome-routing.module';

import { WelcomePage } from './welcome.page';
import { WelcomeAuthenticatedComponent } from './components/welcome-authenticated/welcome-authenticated.component';
import { WelcomeUnauthenticatedComponent } from './components/welcome-unauthenticated/welcome-unauthenticated.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcomePageRoutingModule
  ],
  declarations: [WelcomePage, WelcomeAuthenticatedComponent, WelcomeUnauthenticatedComponent]
})
export class WelcomePageModule {}
