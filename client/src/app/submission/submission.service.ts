import { HttpBackend, HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Festival } from '../admin/services/admin-festival.service';
import { Fort } from '../admin/services/admin-fort.service';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  httpUpload: HttpClient;

  constructor(private http: HttpClient, private handler: HttpBackend) {
    this.httpUpload = new HttpClient(this.handler);
  }

  createSubmission(submission: any, fort: Fort, festival: Festival) {
    return this.http.post(`${environment.apiUrl}/festivals/${festival.id}/forts/${fort.id}/submissions`, submission).toPromise();
  }

  getHealthCheck() {
    return this.http.get(`${environment.apiUrl}/healthcheck`).toPromise();
  }

  async getUploadUrl(asset: any) {
    const encodedFileName = encodeURIComponent(asset.fileName);
    const encodedFileType = encodeURIComponent(asset.fileType);
    return await this.http.get(`${environment.apiUrl}/photo-upload-url?fileName=${encodedFileName}&fileType=${encodedFileType}`)
      .pipe(
        map((response: { uploadUrl: string }) => response.uploadUrl)
      )
      .toPromise();
  }

  async uploadAsset(asset: { mimeType: string, file: Blob, fileName: string }) {
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
}
