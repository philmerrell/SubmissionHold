import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthService, Tokens } from '../../../auth/auth.service';
import { Festival, AdminFestivalService } from '../../services/admin-festival.service';
import { ComposeFestivalModalComponent } from '../../shared/compose-festival-modal/compose-festival-modal.component';
import { User, UserService } from '../../../auth/user.service';
import { Clipboard } from '@capacitor/clipboard';


@Component({
  selector: 'app-settings-page',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  categories = [];
  festivals: Festival[] = [];
  festivalsRequestComplete: boolean;

  tokens: Tokens;
  user: User;
  decodedAccessToken;
  decodedIdToken;
  accessToken;
  healthCheck;

  constructor(
    private modalController: ModalController,
    private festivalService: AdminFestivalService,
    private userService: UserService,
    private authService: AuthService,
    private toastController: ToastController
    ) { }

  ngOnInit(): void {
    this.subscribeToUser();
    this.getFestivals();
  }

  ionViewDidEnter() {
    
  }


  async getFestivals() {
    try {
      this.festivals = await this.festivalService.getFestivals();
    } catch (error) {
      console.log(error);
    }
    this.festivalsRequestComplete = true;
  }

  async presentComposeFestivalModal(festival?: Festival) {
    const modal = await this.modalController.create({
      component: ComposeFestivalModalComponent,
      componentProps: {
        festival
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      this.saveFestival(data);
    }
  }

  private async saveFestival(festival: Festival) {
    try {
      const response = await this.festivalService.saveFestival(festival);
      this.updateFestivalsArray(response);
      
    } catch (error) {
      console.log(error);
    }
  }

  private updateFestivalsArray(festival: Festival) {
    const foundIndex = this.festivals.findIndex(f => f.id === festival.id);
    if (foundIndex !== -1) {
      this.festivals.splice(foundIndex, 1, festival);
    } else {
      this.festivals.unshift(festival);
    }
  }





  subscribeToUser() {
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



}
