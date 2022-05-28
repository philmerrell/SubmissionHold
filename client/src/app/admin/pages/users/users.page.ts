import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { InviteUserModalComponent } from './invite-user-modal/invite-user-modal.component';
import { CognitoUser, UserService } from './user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  users: CognitoUser[] = [];
  usersResponseComplete: boolean;
  selectedGroupName: 'admin' | 'voter' = 'voter';
  constructor(
    private alertController: AlertController,
    private cognitoUserService: UserService,
    private modalController: ModalController,
    private toastController: ToastController) { }

  async ngOnInit() {
    this.getUsers(this.selectedGroupName);
  }

  async confirmDeleteUser(user: CognitoUser) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete',
      message: `Are you sure you want to delete ${user.email}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            
          }
        }, {
          text: 'Okay',
          id: 'confirm-button',
          handler: () => {
            this.deleteUser(user);
          }
        }
      ]
    });
    await alert.present();
  }

  async getUsers(group: 'admin' | 'voter') {
    this.users = [];
    this.usersResponseComplete = false;
    try {
      this.users = await this.cognitoUserService.listUsersInGroup(group);
    } catch (error) {
      console.log(error);
    }
    this.usersResponseComplete = true;
  }

  async deleteUser(user: CognitoUser) {
    try {
      await this.cognitoUserService.deleteUser(user.username);
      const foundIndex = this.users.findIndex(u => u.email === user.email);
      console.log(foundIndex, user, this.users);
      if (foundIndex != -1) {
        this.users.splice(foundIndex, 1);
        this.presentToast(user.email, 'deleted')
      }
    } catch (error) {

    }
  }

  async createUser(info: { role: 'admin' | 'voter', email: string}) {
    try {
      let user: CognitoUser = await this.cognitoUserService.createUser(info.email);

      try {
        this.cognitoUserService.addUserToGroup(user, info.role);
        user = this.cognitoUserService.getEmailFromAttributes(user);

        if (this.selectedGroupName === info.role) {
          this.users.push(user);
        }
        this.presentToast(user.email, 'invited')
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async presentInviteUserModal() {
    const modal = await this.modalController.create({
      component: InviteUserModalComponent,
      componentProps: {
        role: this.selectedGroupName
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.createUser(data);
    }
  }

  userGroupSelectHandler(event) {
    this.selectedGroupName = event.detail.value;
    this.getUsers(this.selectedGroupName);
  }

  private async presentToast(user: string, action) {
    const toast = await this.toastController.create({
      message: `${user} has been ${action}.`,
      duration: 3000,
      color: 'dark'
    });
    toast.present();
  }

}
