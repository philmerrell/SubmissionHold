import { HttpBackend, HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Festival } from '../admin/services/admin-festival.service';
import { Fort } from '../admin/services/admin-fort.service';
import { Submission } from '../admin/services/submission.service';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  httpUpload: HttpClient;
  reloadMySubmissionsSubject: Subject<{ reload: boolean }> = new BehaviorSubject({ reload: false });

  constructor(private http: HttpClient, private handler: HttpBackend) {
    this.httpUpload = new HttpClient(this.handler);
  }

  async createSubmission(submission: any, fort: Fort, festival: Festival) {
    const response = await this.http.post(`${environment.apiUrl}/festivals/${festival.id}/forts/${fort.id}/submissions`, submission).toPromise();
    this.reloadMySubmissionsSubject.next({ reload: true });
    return response;
  }

  getReloadMySubmissionsObservable() {
    return this.reloadMySubmissionsSubject.asObservable();
  }

  getSubmission(festivalId: string, fortId: string, submissionId: string): Promise<Submission> {
    return this.http.get<Submission>(`${environment.apiUrl}/festivals/${festivalId}/forts/${fortId}/submissions/${submissionId}`).toPromise();
  }

  getHealthCheck() {
    return this.http.get(`${environment.apiUrl}/healthcheck`).toPromise();
  }

  async getUploadUrl(asset: any) {
    const encodedFileName = encodeURIComponent(`${asset.festivalId}/${asset.uuid}/${asset.fileName}`);
    const encodedFileType = encodeURIComponent(asset.fileType);
    return await this.http.get(`${environment.apiUrl}/photo-upload-url?fileName=${encodedFileName}&fileType=${encodedFileType}`)
      .pipe(
        map((response: { uploadUrl: string }) => response.uploadUrl)
      )
      .toPromise();
  }

  async uploadAsset(asset: { uuid: string, mimeType: string, festivalId: string, file: Blob, fileName: string }) {
    // this.showUploadProgressToast();
    const uploadUrl = await this.getUploadUrl(asset);
    const headers = new HttpHeaders({'Content-Type': asset.mimeType});    
    console.log(uploadUrl);
    try {
      await this.httpUpload.put(uploadUrl, asset.file, { reportProgress: true, observe: 'events', headers })
        .pipe(map((event: any) => {
          switch (event.type) {
            case 1:
              // Upload is in progress.
              const progress = event.loaded / event.total;
              // this.fileProgressService.setUploadProgress(progress);
              return { status: 'progress', message: progress };

            case HttpEventType.Response:
              // Upload has finished.
              // this.fileProgressService.setUploadProgress(0);
              // this.uploadProgressToast.dismiss();
              return event.body;
            default:
              return `Unhandled event: ${event.type}`;
          }
          })
        ).toPromise();
       
      return asset;
    } catch (error) {
      // this.uploadProgressToast.dismiss();
      console.error(error);
    }
  }

  getStates() {
    return [
      { 'label':'Alabama', 'value': 'AL' },
      { 'label':'Alaska', 'value': 'AK'},
      { 'label':'Arizona', 'value': 'AZ'},
      { 'label':'Arkansas', 'value': 'AR'},
      { 'label':'California', 'value': 'CA'},
      { 'label':'Colorado', 'value': 'CO'},
      { 'label':'Connecticut', 'value': 'CT'},
      { 'label':'Delaware', 'value': 'DE'},
      { 'label':'Florida', 'value': 'FL'},
      { 'label':'Georgia', 'value': 'GA' },
      { 'label':'Hawaii', 'value': 'HI'},
      { 'label':'Idaho', 'value': 'ID'},
      { 'label':'Illinois', 'value': 'IL'},
      { 'label':'Indiana', 'value': 'IN'},
      { 'label':'Iowa', 'value': 'IA'},
      { 'label':'Kansas', 'value': 'KS'},
      { 'label':'Kentucky', 'value': 'KY'},
      { 'label':'Louisiana', 'value': 'LA'},
      { 'label':'Maine', 'value': 'ME'},
      { 'label':'Maryland', 'value': 'MD'},
      { 'label':'Massachusetts', 'value': 'MA'},
      { 'label':'Michigan', 'value': 'MI'},
      { 'label':'Minnesota', 'value': 'MN'},
      { 'label':'Mississippi', 'value': 'MS'},
      { 'label':'Missouri', 'value': 'MO'},
      { 'label':'Montana', 'value': 'MT'},
      { 'label':'Nebraska', 'value': 'NE'},
      { 'label':'Nevada', 'value': 'NV'},
      { 'label':'New Hampshire', 'value': 'NH'},
      { 'label':'New Jersey', 'value': 'NJ'},
      { 'label':'New Mexico', 'value': 'NM'},
      { 'label':'New York', 'value': 'NY'},
      { 'label':'North Carolina', 'value': 'NC'},
      { 'label':'North Dakota', 'value': 'ND'},
      { 'label':'Ohio', 'value': 'OH'},
      { 'label':'Oklahoma', 'value': 'OK'},
      { 'label':'Oregan', 'value': 'OR'},
      { 'label':'Pennsylvania', 'value': 'PA'},
      { 'label':'Rhode Island', 'value': 'RI'},
      { 'label':'South Carolina', 'value': 'SC'},
      { 'label':'South Dakota', 'value': 'SD'},
      { 'label':'Tennessee', 'value': 'TN'},
      { 'label':'Texas', 'value': 'TX'},
      { 'label':'Utah', 'value': 'UT'},
      { 'label':'Vermont', 'value': 'VT'},
      { 'label':'Virgin Islands', 'value': 'VI'},
      { 'label':'Virginia', 'value': 'VA'},
      { 'label':'Washington', 'value': 'WA'},
      { 'label':'West Virginia', 'value': 'WV'},
      { 'label':'Wisconsin', 'value': 'WI'},
      { 'label':'Wyoming', 'value': 'WY'}
      ];
  }

  getGenres() {
    return [
      'Acoustic',
      'Alternative',
      'Ambient',
      'Americana',
      'Bluegrass',
      'Blues',
      'Classical',
      'Country',
      'Dance',
      'DJ',
      'Doom',
      'Dream Pop',
      'Electronic',
      'Experimental',
      'Folk',
      'Funk',
      'Garage',
      'Goth',
      'Hardcore',
      'Heavy',
      'Hip-hop',
      'Indie',
      'Industrial',
      'Jazz',
      'Latin',
      'Lo-fi',
      'Metal',
      'New Wave',
      'Pop',
      'Post-Rock',
      'Psychedelic',
      'Punk',
      'R&B',
      'Rap',
      'Reggae / Ska',
      'Rock',
      'Shoegaze',
      'Singer-Songwriter',
      'Soul',
      'Surf',
      'World',
      'Canada'
    ]
  }

  
}
