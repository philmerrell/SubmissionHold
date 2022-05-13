import { Component, OnInit } from '@angular/core';
import { CognitoUser, UserService } from './user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  users: CognitoUser[] = [];
  usersResponseComplete: boolean;
  constructor(private cognitoUserService: UserService) { }

  async ngOnInit() {
    this.getUsers();
  }

  async getUsers() {
    this.usersResponseComplete = false;
    try {
      this.users = await this.cognitoUserService.listUsersInGroup('admin');
    } catch (error) {

    }
    this.usersResponseComplete = true;
  }

}
