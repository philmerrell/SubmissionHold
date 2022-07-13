import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Festival } from './admin-festival.service';
import { Fort } from './admin-fort.service';

export interface SubmissionsApiResponse {
  pageSize: string;
  paginationKey: string;
  submissions: []
}

export interface Submission {}

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  submissionsPaginationKey: string;
  constructor(private http: HttpClient) { }

  getSubmissions(festival: Festival, fort: Fort, paginationKey?: string): Promise<SubmissionsApiResponse>{
    // `${environment.apiUrl}/festivals/${festival.id}/forts/${fort.id}/submissions?pageSize=100`
    const url = paginationKey ? `${environment.apiUrl}/festivals/${festival.id}/forts/${fort.id}/submissions?pageSize=100&paginationKey=${paginationKey}` : `${environment.apiUrl}/festivals/${festival.id}/forts/${fort.id}/submissions?pageSize=100`;
    return this.http.get<SubmissionsApiResponse>(url).toPromise();
  }

  getSubmission(festival: Festival, fort: Fort, id: string): Promise<Submission> {
    return this.http.get<Submission>(`${environment.apiUrl}/festivals/${festival.id}/forts/${fort.id}/submissions/${id}`).toPromise();
  }
  
}
