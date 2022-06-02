import { Component, Input, OnInit } from '@angular/core';
import { SettingService } from '../../admin/services/setting.service';
import { User } from '../../auth/user.service';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss'],
})
export class AdminMenuComponent implements OnInit {
  @Input() user: User;

  public labels = [];

  constructor(private settingService: SettingService) { }

  ngOnInit() {
    this.getLabels();
  }

  getLabels() {
    this.labels = this.settingService.getLabels();
  }

}
