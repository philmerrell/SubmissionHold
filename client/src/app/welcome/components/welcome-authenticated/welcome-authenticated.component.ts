import { Component, Input, OnInit } from '@angular/core';
import { Festival } from '../../../admin/services/admin-festival.service';
import { AdminFortService, Fort } from '../../../admin/services/admin-fort.service';
import { ActiveFestivalService } from '../../../shared/active-festival.service';

@Component({
  selector: 'app-welcome-authenticated',
  templateUrl: './welcome-authenticated.component.html',
  styleUrls: ['./welcome-authenticated.component.scss'],
})
export class WelcomeAuthenticatedComponent implements OnInit {
  festivalRequestComplete: boolean;
  festival: Festival;
  forts: Fort[];
  fortsRequestComplete: boolean;

  constructor(private activeFestivalService: ActiveFestivalService, private fortService: AdminFortService) { }

  async ngOnInit() {
    await this.getActiveFestival();
    this.getForts();
  }

  async getActiveFestival() {
    this.festival = await this.activeFestivalService.getActiveFestival();
    this.festivalRequestComplete = true;
  }
  
  async getForts() {
    this.forts = await this.fortService.getForts(this.festival.id);
    this.fortsRequestComplete = true;
  }

}
