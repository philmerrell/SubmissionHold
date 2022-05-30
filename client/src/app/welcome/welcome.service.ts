import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WelcomeService {

  constructor(private http: HttpClient) { }

  getActiveFestival() {
    return {
      id: 'test',
      name: 'Treefort 2023',
      guidelines: 'Guidelines go here...',
      startDateTime: '2022-07-10',
      endDateTime: '2022-12-01'
    }
  }
}
