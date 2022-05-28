import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface CognitoUser {
  username: string;
  attributes: { name: string, value: string }[];
  userCreateDate: string;
  userLastModifiedDate: string;
  enabled: boolean;
  userStatus: string;
  email: string;
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  addUserToGroup(user: CognitoUser, groupName: 'admin' | 'voter') {
    return this.http.post(`${environment.authUrl}/v1/admin/add-user-to-group`, { username: user.username, groupName }).toPromise();
  }

  createUser(email: string): Promise<CognitoUser> {
    return this.http.post<CognitoUser>(`${environment.authUrl}/v1/admin/create-user`, { email })
      .pipe(
        map((response: any) => response.user),
      ).toPromise();
  }

  listUsersInGroup(groupName: string): Promise<CognitoUser[]> {
    return this.http.get<CognitoUser[]>(`${environment.authUrl}/v1/admin/list-users-in-group?groupName=${groupName}`)
      .pipe(
        map(response => response['users']),
        map(this.mapEmailAttributes),
      ).toPromise();
  }

  deleteUser(username: string) {
    return this.http.post(`${environment.authUrl}/v1/admin/delete-user`, { username }).toPromise();
  }

  mapEmailAttributes = (users: CognitoUser[]): CognitoUser[] => {
    for (let user of users) {
      user = this.getEmailFromAttributes(user);
    }
    return users;
  }

  getEmailFromAttributes = (user: CognitoUser): CognitoUser => {
    const email = user.attributes.find(attribute => attribute.name === 'email');
    user.email = email.value;
    return user;
  }
}
