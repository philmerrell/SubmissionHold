import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Festival, AdminFestivalService } from '../../services/admin-festival.service';
import { ComposeFestivalModalComponent } from '../../shared/compose-festival-modal/compose-festival-modal.component';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  categories = [];
  festivals: Festival[] = [];
  festivalsRequestComplete: boolean;

  constructor(
    private modalController: ModalController,
    private festivalService: AdminFestivalService) { }

  ngOnInit() {
    this.getFestivals();
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
      console.log(festival);
      await this.festivalService.saveFestival(festival);
      this.updateFestivalsArray(festival);
      
    } catch (error) {
      console.log(error);
    }
  }

  private updateFestivalsArray(festival: Festival) {
    const foundIndex = this.festivals.findIndex(f => f.id === festival.id);
    if (foundIndex) {
      this.festivals.splice(foundIndex, 1, festival);
    } else {
      this.festivals.unshift(festival);
    }
  }



}
