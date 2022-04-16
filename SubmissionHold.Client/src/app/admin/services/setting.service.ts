import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor() { }

  getCategories() {
    return [ 'Music', 'Film', 'Comedy', 'Art', 'Tech']
  }

  getHolds(): any[] {
    return [
      { name: 'Treefort 2023', archived: false, active: true },
      { name: 'Treefort 2022', archived: true, active: false },
      { name: 'Treefort 2021', archived: true, active: false },
      { name: 'Treefort 2020', archived: true, active: false },
    ]
  }
}
