import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Submission } from './submission.service';

export interface LabelsResponse {
  festivalId: string;
  labels: Label[];
  pageSize: number;
  paginationKey: string;
}

export interface Label {
  id: string;
  name: string;
}

export interface LabelRequest {
  name: string;
  submissionIds: string[];
}

@Injectable({
  providedIn: 'root'
})
export class LabelService {
  private reloadLabelsBehaviorSubject: BehaviorSubject<{ reload: boolean }> = new BehaviorSubject({ reload: false });
  constructor(private http: HttpClient) { }

  getLabels(festivalId: string): Promise<LabelsResponse> {
    return this.http.get<LabelsResponse>(`${environment.apiUrl}/festivals/${festivalId}/labels?pageSize=100`).toPromise();
  }

  createLabel(festivalId: string, labelRequest: LabelRequest): Promise<Label> {
    return this.http.post<Label>(`${environment.apiUrl}/festivals/${festivalId}/labels`, labelRequest).toPromise();
  }

  getSubmissionsWithLabel(festivalId: string, labelId: string, paginationKey?: string): Promise<Submission[]> {
    const url = paginationKey ? `${environment.apiUrl}/festivals/${festivalId}/labels/${labelId}?pageSize=100&paginationKey=${paginationKey}` : `${environment.apiUrl}/festivals/${festivalId}/labels/${labelId}?pageSize=100`
    return this.http.get<Submission[]>(url).toPromise();
  }

  deleteLabel(festivalId: string, labelId: string): Promise<void> {
    return this.http.delete<void>(`${environment.apiUrl}/festivals/${festivalId}/labels/${labelId}`).toPromise();
  }

  setReloadLabels(reload: boolean) {
    this.reloadLabelsBehaviorSubject.next({ reload });
  }

  getReloadLabelsObservable(): Observable<{reload: boolean}> {
    return this.reloadLabelsBehaviorSubject.asObservable();
  }
}
