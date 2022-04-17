import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getUsers() {
    return [
      {
        first: 'Eric',
        last: 'Gilbert',
        role: 'Admin'
      },
      {
        first: 'Ivy',
        last: 'Merrell',
        role: 'Voter'
      },
      {
        first: 'Angel',
        last: 'Moroni',
        role: 'Invitation Sent'
      },
      {
        first: 'Joseph',
        last: 'Smith',
        role: 'Invitation Sent'
      },
    ];
  }
}
