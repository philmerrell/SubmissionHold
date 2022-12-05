import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface MySubmissionsResponse {
  festivalId: string;
  fortId: string;
  pageSize: number;
  paginationKey: string;
  submissions: MySubmission[];
}

export interface MySubmission {
  city: string;
  country: string;
  id: string;
  image: string;
  name: string;
  state: string;
}

@Injectable({
  providedIn: 'root'
})
export class MySubmissionService {

  constructor(private http: HttpClient) { }

  getMySubmissions(username: string, festivalId: string): Promise<MySubmission[]> {
    return this.http.get(`${environment.apiUrl}/festivals/64bd0f67-34c2-48d0-a48b-9a46daabf4d6/submissions?createdBy=${username}&pageSize=100`)
      .pipe(
        map((response: MySubmissionsResponse) => response.submissions)
      ).toPromise();
  }
}
