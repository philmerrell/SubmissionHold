import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  user;
  accessToken;
  constructor(private authService: AuthService) { }

  async ngOnInit() {
    const tokens = await this.authService.getAuthTokens();
    this.accessToken = tokens.access_token;
    this.user = this.authService.decodeAccessToken(tokens.access_token);
  }

}
