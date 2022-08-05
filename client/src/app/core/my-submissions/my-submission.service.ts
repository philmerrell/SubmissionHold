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
    return this.http.get(`${environment.apiUrl}/festivals/${festivalId}/submissions?createdBy=${username}&pageSize=100`)
      .pipe(
        map((response: MySubmissionsResponse) => response.submissions)
      ).toPromise();
  }
}
