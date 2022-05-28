import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SettingService } from '../../services/setting.service';
import { CreateFestivalModalComponent } from './create-festival-modal/create-festival-modal.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  categories = [];
  holds = [];

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
    this.holds = this.settingService.getFestivals();
  }

  async presentCreateFestivalModal() {
    const modal = await this.modalController.create({
      component: CreateFestivalModalComponent
    });
    await modal.present();
  }

}
