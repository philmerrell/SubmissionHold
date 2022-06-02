import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../auth/user.service';
import { WelcomeService } from './welcome.service';
import { Festival } from '../admin/services/admin-festival.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  user$: Observable<User>;

  constructor(
    private userService: UserService) { }

  async ngOnInit() {
    this.user$ = this.userService.getUserObservable();
  }

}
