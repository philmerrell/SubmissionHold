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
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  listUsersInGroup(groupName: string): Promise<CognitoUser[]> {
    return this.http.get<CognitoUser[]>(`${environment.authUrl}/v1/admin/list-users-in-group?groupName=${groupName}`)
      .pipe(map(response => response['Users'])).toPromise();
  }
}
