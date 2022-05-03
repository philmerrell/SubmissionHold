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
  public appPages = [
    { title: 'Submissions', url: '/admin/submissions', icon: 'folder' },
    { title: 'My Votes', url: '/admin/my-votes', icon: 'ticket' },
    { title: 'Ignored', url: '/admin/ignored', icon: 'skull' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Users', url: '/admin/users', icon: 'people' },
    { title: 'Settings', url: '/admin/settings', icon: 'settings' },
  ];
  public labels = [];
  user: User;

  constructor(private settingService: SettingService, private authService: AuthService, private userService: UserService) {
    this.getLabels();
    this.userService.getUserObservable().subscribe((user: User ) => this.user = user);
    this.authService.isAuthenticated();
  }

  getLabels() {
    this.labels = this.settingService.getLabels();
  }

  

  logout() {
    this.authService.logout();
  }
  
}
