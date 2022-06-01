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
  festival: Festival;

  constructor(
    private userService: UserService,
    private welcomeService: WelcomeService) { }

  async ngOnInit() {
    this.user$ = this.userService.getUserObservable();
    this.festival = await this.welcomeService.getActiveFestival();
  }

}
