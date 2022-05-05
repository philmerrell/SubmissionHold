import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private authService: AuthService, private router: Router) {}

  async canLoad(
    route: Route,
    segments: UrlSegment[]): Promise<boolean> {

      const isAuthenticated = await this.authService.isAuthenticated();
      if (isAuthenticated) {
        return true;
      } else {
        this.router.navigateByUrl('/welcome');
        return false;
      }
  }

}
