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

  public appPages = [
    { title: 'Inbox', url: '/admin/submissions', icon: 'folder' },
    { title: 'My Votes', url: '/admin/my-votes', icon: 'ticket' },
    { title: 'Ignored', url: '/admin/ignored', icon: 'skull' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Users', url: '/admin/users', icon: 'people' },
    { title: 'Settings', url: '/admin/settings', icon: 'settings' },
  ];
  public labels = [];

  constructor(private settingService: SettingService) { }

  ngOnInit() {
    this.getLabels();
  }

  getLabels() {
    this.labels = this.settingService.getLabels();
  }

}
