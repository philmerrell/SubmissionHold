import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface LabelsResponse {
  festivalId: string;
  labels: Label[];
  pageSize: number;
  paginationKey: string;
}

export interface Label {
  id: string;
  name: string;
  isChecked?: boolean;
}

export interface LabelRequest {
  name: string;
  submissionIds: string[];
}

export interface LabeledSubmissionsResponse {
  pageSize: string;
  paginationKey: string;
  submissions: []
}

@Injectable({
  providedIn: 'root'
})
export class LabelService {
  private reloadLabelsBehaviorSubject: BehaviorSubject<{ reload: boolean }> = new BehaviorSubject({ reload: false });
  constructor(private http: HttpClient) { }

  addSubmissionToLabel(festivalId: string, labelRequest: LabelRequest) {
    return this.http.post<Label>(`${environment.apiUrl}/festivals/${festivalId}/labels`, labelRequest).toPromise();
  }

  getLabels(festivalId: string): Promise<LabelsResponse> {
    return this.http.get<LabelsResponse>(`${environment.apiUrl}/festivals/${festivalId}/labels?pageSize=200`)
      .pipe(
        map((response: LabelsResponse) => {
          response.labels.sort((a, b) => a.name > b.name ? 1 : -1);
          return response;
        })
      )
      .toPromise();
  }

  async createLabel(festivalId: string, labelRequest: LabelRequest): Promise<Label> {
    const response = await this.http.post<Label>(`${environment.apiUrl}/festivals/${festivalId}/labels`, labelRequest).toPromise();
    if (!labelRequest.submissionIds.length) {
      this.setReloadLabels(true);
    }
    return response;
  }

  getSubmissionsWithLabel(festivalId: string, labelId: string, paginationKey?: string): Promise<LabeledSubmissionsResponse> {
    const url = paginationKey ? `${environment.apiUrl}/festivals/${festivalId}/labels/${labelId}?pageSize=100&paginationKey=${paginationKey}` : `${environment.apiUrl}/festivals/${festivalId}/labels/${labelId}?pageSize=100`
    return this.http.get<LabeledSubmissionsResponse>(url).toPromise();
  }

  deleteLabel(festivalId: string, labelId: string, submissionId?: string): Promise<void> {
    const queryParam = submissionId ? `?submissionId=${submissionId}` : '';
    return this.http.delete<void>(`${environment.apiUrl}/festivals/${festivalId}/labels/${labelId}${queryParam}`).toPromise();
  }

  setReloadLabels(reload: boolean) {
    this.reloadLabelsBehaviorSubject.next({ reload });
  }

  getReloadLabelsObservable(): Observable<{reload: boolean}> {
    return this.reloadLabelsBehaviorSubject.asObservable();
  }
}
