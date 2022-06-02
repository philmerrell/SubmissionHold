import { Component, Input, OnInit } from '@angular/core';
import { Festival } from '../../../admin/services/admin-festival.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-welcome-unauthenticated',
  templateUrl: './welcome-unauthenticated.component.html',
  styleUrls: ['./welcome-unauthenticated.component.scss'],
})
export class WelcomeUnauthenticatedComponent implements OnInit {
  constructor(private authService: AuthService) { }

  ngOnInit() {}

  login() {
    this.authService.login();
  }

  signup() {
    this.authService.signUp();
  }

}
