import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Festival } from '../../admin/services/admin-festival.service';
import { LabelService, LabelsResponse } from '../../admin/services/label.service';
import { User } from '../../auth/user.service';
import { ActiveFestivalService } from '../../shared/active-festival.service';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss'],
})
export class AdminMenuComponent implements OnInit {
  @Input() user: User;
  activeFestival: Festival;
  labelResponse: LabelsResponse;
  labelsRequestComplete: boolean;

  constructor(private alertController: AlertController, private festivalService: ActiveFestivalService, private labelService: LabelService) { }

  async ngOnInit() {
    console.log(this.user);
    this.activeFestival = await this.festivalService.getActiveFestival();
    this.getLabels();
  }

  async createLabel(name: string) {
    await this.labelService.createLabel(this.activeFestival.id, { name, submissionIds: []});
    this.getLabels();
  }

  async getLabels() {
    this.labelsRequestComplete = false;
    this.labelResponse = await this.labelService.getLabels(this.activeFestival.id);
    this.labelsRequestComplete = true;
  }

  async presentCreateLabelAlert() {
    const alert = await this.alertController.create({
      header: 'Create a Label',
      inputs: [
        {
          name: 'name',
          placeholder: 'Enter a label name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          role: 'confirm'
        }
      ]
    });

    await alert.present();

    const { role, data } = await alert.onDidDismiss();
    console.log(data);
    if (role === 'confirm' && data.values.name !== '') {
      this.createLabel(data.values.name);
    }
  }



}
