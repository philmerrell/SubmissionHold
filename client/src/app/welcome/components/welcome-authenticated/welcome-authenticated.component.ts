import { Component, Input, OnInit } from '@angular/core';
import { Festival } from '../../../admin/services/admin-festival.service';
import { AdminFortService, Fort } from '../../../admin/services/admin-fort.service';

@Component({
  selector: 'app-welcome-authenticated',
  templateUrl: './welcome-authenticated.component.html',
  styleUrls: ['./welcome-authenticated.component.scss'],
})
export class WelcomeAuthenticatedComponent implements OnInit {
  @Input() festival: Festival;
  forts: Fort[];
  constructor(private fortService: AdminFortService) { }

  ngOnInit() {
    this.getForts();
  }

  async getForts() {
    this.forts = await this.fortService.getForts(this.festival.id);
  }

}
