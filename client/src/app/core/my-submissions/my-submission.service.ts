import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MySubmissionService {

  constructor(private http: HttpClient) { }

  getMySubmissions(username: string, festivalId: string, fortId: string) {
    return this.http.get(`${environment.apiUrl}/festivals/${festivalId}/forts/${fortId}/submissions?createdBy=${username}&pageSize=100`).toPromise();
  }
}
