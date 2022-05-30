import { Component, Input, OnInit } from '@angular/core';
import { Festival } from '../../../admin/services/admin-festival.service';

@Component({
  selector: 'app-welcome-authenticated',
  templateUrl: './welcome-authenticated.component.html',
  styleUrls: ['./welcome-authenticated.component.scss'],
})
export class WelcomeAuthenticatedComponent implements OnInit {
  @Input() festival: Festival;
  constructor() { }

  ngOnInit() {}

}
