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
    this.subscribeToUserObservable();
    this.authService.isAuthenticated();
  }

  
  subscribeToUserObservable() {
    this.userService.getUserObservable().subscribe((user: User ) => {
      this.user = user
      if (user.authenticated) {
        // get active festival
        // get all forts
        // get all submissions for all forts
        // getUsersSubmitted 
      }
    });
  }

  

  logout() {
    this.authService.logout();
  }
  
}
