import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Festival, SettingService } from '../../services/setting.service';
import { CreateFestivalModalComponent } from './create-festival-modal/create-festival-modal.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  categories = [];
  festivals: Festival[] = [];
  festivalsRequestComplete: boolean;

  constructor(
    private modalController: ModalController,
    private settingService: SettingService) { }

  ngOnInit() {
    this.getCategories();
    this.getFestivals();
  }

  getCategories() {
    this.categories = this.settingService.getCategories();
  }

  getFestivals() {
    try {
      this.festivals = this.settingService.getFestivals();
    } catch (error) {
      console.log(error);
    }
    this.festivalsRequestComplete = true;
  }

  async presentCreateFestivalModal() {
    const modal = await this.modalController.create({
      component: CreateFestivalModalComponent
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      this.settingService.saveFestival(data);
    }
  }

}
