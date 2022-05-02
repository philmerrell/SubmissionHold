import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Clipboard } from '@capacitor/clipboard';
import { ToastController } from '@ionic/angular';
import { SubmissionService } from '../submission/submission.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  decodedAccessToken;
  decodedIdToken;
  accessToken;
  healthCheck;

  constructor(
    private authService: AuthService,
    private submissionService: SubmissionService,
    private toastController: ToastController) { }

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

  async getHealthCheck() {
    this.healthCheck = await this.submissionService.getHealthCheck();
  }

  login() {
    this.authService.login();
  }

  signup() {
    this.authService.signUp();
  }

}
