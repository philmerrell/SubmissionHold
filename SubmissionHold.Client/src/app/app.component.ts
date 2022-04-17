import { Component } from '@angular/core';
import { SettingService } from './admin/services/setting.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Submissions', url: '/admin/submissions', icon: 'folder' },
    { title: 'My Votes', url: '/admin/my-votes', icon: 'ticket' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Users', url: '/admin/users', icon: 'people' },
    { title: 'Settings', url: '/admin/settings', icon: 'settings' },
  ];
  public labels = [];

  constructor(private settingService: SettingService) {
    this.getLabels();
  }

  getLabels() {
    this.labels = this.settingService.getLabels();
  }
}
