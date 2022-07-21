import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import { Festival, AdminFestivalService } from '../../services/admin-festival.service';
import { Fort, AdminFortService } from '../../services/admin-fort.service';
import { Label, LabelService, LabelsResponse } from '../../services/label.service';
import { ComposeFestivalModalComponent } from '../../shared/compose-festival-modal/compose-festival-modal.component';

@Component({
  selector: 'app-settings-festival-detail',
  templateUrl: './settings-festival-detail.page.html',
  styleUrls: ['./settings-festival-detail.page.scss'],
})
export class SettingsFestivalDetailPage implements OnInit {
  festival: Festival;
  forts: Fort[];
  fortCreateComplete: boolean = true;
  fortPendingDeleteId: string;
  fortsRequestComplete: boolean;
  labelCreateComplete: boolean = true;
  labelPendingDeleteId: string;
  labelsRequestComplete: boolean;
  labelResponse: LabelsResponse;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private festivalService: AdminFestivalService,
    private fortService: AdminFortService,
    private labelService: LabelService,
    private modalController: ModalController,
    private navController: NavController,
    private router: Router,
    private toastController: ToastController) { }

  async ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.festival = await this.festivalService.getFestival(params.id);
    this.getForts();
    this.getLabels();
  }

  async getForts() {
    this.forts = await this.fortService.getForts(this.festival.id);
    this.fortsRequestComplete = true;
  }

  async getLabels() {
    this.labelsRequestComplete = false;
    this.labelResponse = await this.labelService.getLabels(this.festival.id);
    this.labelsRequestComplete = true;
  }

  async presentDeleteFestivalAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete',
      message: 'This is probably a bad idea. Are you sure you want to delete this festival?',
      inputs: [
        {
          name: 'delete',
          type: 'text',
          placeholder: 'Type "delete"'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Delete',
          handler: (values) => {
            if(values.delete === 'delete') {
              this.deleteFestival();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async presentDeleteFortAlert(fort: Fort) {
    const alert = await this.alertController.create({
      header: 'Delete',
      message: 'You probably don\'t want to do this...',
      inputs: [
        {
          name: 'delete',
          type: 'text',
          placeholder: 'Type "delete"'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Delete',
          handler: (values) => {
            if(values.delete === 'delete') {
              this.deleteFort(fort);
            }
          }
        }
      ]
    });

    await alert.present();
    await alert.onDidDismiss();
    this.fortPendingDeleteId = null;
  }

  async presentComposeFestivalModal(festival: Festival) {
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
      await this.festivalService.saveFestival(festival);
      this.festival = festival;
      
    } catch (error) {
      console.log(error);
    }
  }

  private async deleteFestival() {
    try {
      await this.festivalService.deleteFestival(this.festival);
      const toast = await this.toastController.create({
        message: `${this.festival.name} has been deleted.`,
        color: 'dark',
        duration: 3000
      });
      this.navController.setDirection('back');
      this.router.navigate(['../admin/settings'], { replaceUrl: true });
      toast.present();
    } catch(error) {

    }
  }

  private async deleteFort(fort: Fort) {
    try {
      this.fortPendingDeleteId = fort.id;
      await this.fortService.deleteFort(this.festival, fort);
      const toast = await this.toastController.create({
        message: `The ${fort.name} fort has been deleted.`,
        color: 'dark',
        duration: 3000
      });
      const foundIndex = this.forts.findIndex(f => f.id === fort.id);
      if (foundIndex !== -1) {
        this.forts.splice(foundIndex, 1);
      }
    } catch(error) {

    }
  }

  async presentComposeFortAlert() {
    const alert = await this.alertController.create({
      header: 'Add a Fort',
      inputs: [
        {
          name: 'fort',
          type: 'text',
          placeholder: 'Enter a fort name'
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Enter fort description'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Add',
          handler: async (values) => {
            if(values.fort) {
              this.fortCreateComplete = false;
              const response = await this.fortService.createFort(this.festival.id, { name: values.fort, description: values.description })
              this.forts.push(response);
            }
            this.fortCreateComplete = true;
          }
        }
      ]
    });
    await alert.present();
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
    if (role === 'confirm' && data.values.name !== '') {
      this.createLabel(data.values.name);
    }
  }

  async createLabel(name: string) {
    await this.labelService.createLabel(this.festival.id, { name, submissionIds: []});
    this.labelService.setReloadLabels(true);
    this.getLabels();
  }

  async presentDeleteLabelAlert(label: Label) {
    const alert = await this.alertController.create({
      header: 'Delete Label',
      message: `Are you sure you want to delete the ${label.name} label?`,
      inputs: [
        {
          name: 'delete',
          type: 'text',
          placeholder: 'Type "delete"'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Delete',
          handler: (values) => {
            if(values.delete === 'delete') {
              this.deleteLabel(label);
            }
          }
        }
      ]
    });

    await alert.present();
    await alert.onDidDismiss();
    this.labelPendingDeleteId = null;
  }

  private async deleteLabel(label: Label) {
    try {
      this.labelPendingDeleteId = label.id;
      await this.labelService.deleteLabel(this.festival.id, label.id);
      const toast = await this.toastController.create({
        message: `The label ${label.name} has been deleted.`,
        color: 'dark',
        duration: 3000
      });

      const foundIndex = this.labelResponse.labels.findIndex(l => l.id === label.id);
      if (foundIndex !== -1) {
        this.labelResponse.labels.splice(foundIndex, 1);
        this.labelService.setReloadLabels(true);
        toast.present();
      }
    } catch(error) {

    }
  }

}
