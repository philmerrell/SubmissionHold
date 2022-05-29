import { Component, OnInit } from '@angular/core';
import { Festival } from '../../../admin/services/setting.service';

@Component({
  selector: 'app-welcome-authenticated',
  templateUrl: './welcome-authenticated.component.html',
  styleUrls: ['./welcome-authenticated.component.scss'],
})
export class WelcomeAuthenticatedComponent implements OnInit {
  festival: Festival = {
    name: 'Treefort 2023',
    guidelines: 'Guidelines go here...',
    startDateTime: '2022-07-10',
    endDateTime: '2022-12-01'
  }
  constructor() { }

  ngOnInit() {}

}
