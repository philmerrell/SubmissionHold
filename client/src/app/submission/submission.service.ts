import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  constructor(private http: HttpClient) { }

  createSubmission(submission: any) {
    return this.http.post(`${environment.apiUrl}/submit`, submission).toPromise();
  }

  getHealthCheck() {
    return this.http.get(`${environment.apiUrl}/healthcheck`).toPromise();
  }
}
