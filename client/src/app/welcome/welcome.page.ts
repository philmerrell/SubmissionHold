import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Clipboard } from '@capacitor/clipboard';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  decodedAccessToken;
  decodedIdToken;
  accessToken;
  constructor(private authService: AuthService, private toastController: ToastController) { }

  async ngOnInit() {
    const tokens = await this.authService.getAuthTokens();
    this.accessToken = tokens.access_token;
    this.decodedAccessToken = this.authService.decodeAccessToken(tokens);
    this.decodedIdToken = this.authService.decodeIdToken(tokens);
  }

  async copyAccessToken() {
    await Clipboard.write({
      string: this.accessToken
    });

    const toast = await this.toastController.create({
      message: 'Access token copied.',
      duration: 3000,
      color: 'dark'
    });
    toast.present();
  }

  login() {
    this.authService.login();
  }

  signup() {
    this.authService.signUp();
  }

}
