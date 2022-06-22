import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Festival } from '../admin/services/admin-festival.service';
import { Fort } from '../admin/services/admin-fort.service';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  constructor(private http: HttpClient) { }

  createSubmission(submission: any, fort: Fort, festival: Festival) {
    return this.http.post(`${environment.apiUrl}/festivals/${festival.id}/forts/${fort.id}/submissions`, submission).toPromise();
  }

  getHealthCheck() {
    return this.http.get(`${environment.apiUrl}/healthcheck`).toPromise();
  }
}
