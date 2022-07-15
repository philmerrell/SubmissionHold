import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { User, UserService } from './auth/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  user: User;

  constructor(private authService: AuthService, private userService: UserService) {
    this.subscribeToUserObservable();
    this.authService.isAuthenticated();
  }
  
  subscribeToUserObservable() {
    this.userService.getUserObservable().subscribe((user: User ) => this.user = user);
  }

  logout() {
    this.authService.logout();
  }
  
}
