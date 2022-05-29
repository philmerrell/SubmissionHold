import { Component, OnInit } from '@angular/core';
import { AuthService, Tokens } from '../auth/auth.service';
import { Clipboard } from '@capacitor/clipboard';
import { ToastController } from '@ionic/angular';
import { SubmissionService } from '../submission/submission.service';
import { User, UserService } from '../auth/user.service';
import { Festival } from '../admin/services/setting.service';
import { WelcomeService } from './welcome.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  user: User;
  festival: Festival;



  tokens: Tokens;
  decodedAccessToken;
  decodedIdToken;
  accessToken;
  healthCheck;

  constructor(
    private authService: AuthService,
    private submissionService: SubmissionService,
    private toastController: ToastController,
    private userService: UserService,
    private welcomeService: WelcomeService) { }

  async ngOnInit() {
    this.userService.getUserObservable()
      .subscribe(async (user: User) => {
        this.user = user;
        if (user.authenticated) {
          const tokens = await this.authService.getAuthTokens();
          this.accessToken = tokens.access_token;
          this.decodedAccessToken = this.authService.decodeAccessToken(tokens);
          this.decodedIdToken = this.authService.decodeIdToken(tokens);
        }
      });
    
    this.festival = this.welcomeService.getActiveFestival();
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

  

}
