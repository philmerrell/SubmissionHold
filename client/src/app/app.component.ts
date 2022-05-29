import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SettingService } from './admin/services/setting.service';
import { AuthService } from './auth/auth.service';
import { User, UserService } from './auth/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  user: User;

  constructor(private settingService: SettingService, private authService: AuthService, private userService: UserService) {
    this.userService.getUserObservable().subscribe((user: User ) => this.user = user);
    this.authService.isAuthenticated();
  }

  

  

  logout() {
    this.authService.logout();
  }
  
}
