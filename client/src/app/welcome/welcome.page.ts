import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../auth/user.service';
import { Observable } from 'rxjs';
import { Festival } from '../admin/services/admin-festival.service';
import { ActiveFestivalService } from '../shared/active-festival.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  festivalRequestComplete: boolean;
  festival: Festival;
  user$: Observable<User>;
  user: User;

  constructor(
    private activeFestivalService: ActiveFestivalService,
    private userService: UserService) { }

  async ngOnInit() {
    // await this.getActiveFestival();
    this.user$ = this.userService.getUserObservable();
  }

  async getActiveFestival() {
    this.festival = await this.activeFestivalService.getActiveFestival();
    this.festivalRequestComplete = true;
  }

}
