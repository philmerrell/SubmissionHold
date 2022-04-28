import { Component, OnInit } from '@angular/core';
import { SettingService } from '../../services/setting.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  categories = [];
  holds = [];

  constructor(private settingService: SettingService) { }

  ngOnInit() {
    this.getCategories();
    this.getHolds();
  }

  getCategories() {
    this.categories = this.settingService.getCategories();
  }

  getHolds() {
    this.holds = this.settingService.getHolds();
  }

}
