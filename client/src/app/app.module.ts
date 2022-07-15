import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpTokenInterceptor } from './auth/http-token-interceptor.service';
import { AdminMenuComponent } from './core/admin-menu/admin-menu.component';
import { MySubmissionsComponent } from './core/my-submissions/my-submissions.component';

@NgModule({
  declarations: [AppComponent, AdminMenuComponent, MySubmissionsComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
