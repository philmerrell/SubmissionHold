import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Festival {
  id: string;
  name: string;
  guidelines: string;
  startDateTime: string;
  endDateTime: string;
  submissionsOpen: boolean;
  isActive: boolean;
}

export interface FestivalsApiResponse {
  pageSize: number;
  paginationKey: string;
  festivals: Festival[]
}

@Injectable({
  providedIn: 'root'
})
export class AdminFestivalService {
  festivals: Festival[];
  activeFestival: Festival;

  constructor(private http: HttpClient) { }

  getActiveFestival(): Promise<Festival> {
    if (!this.activeFestival) {
      return this.http.get<FestivalsApiResponse>(`${environment.apiUrl}/festivals?submissionsOpen=true&pageSize=1&activeOnly=true`)
        .pipe(
          map((response: FestivalsApiResponse) => {
            this.activeFestival = response.festivals[0] || null;
            return this.activeFestival;
          })
        )
        .toPromise();
    } else {
      return Promise.resolve(this.activeFestival);
    }
  }

  async getFestival(id: string) {
    const festivals = await this.getFestivals();
    return festivals.find(f => f.id === id);
  }

  getFestivals(activeOnly: boolean = false, pageSize: number = 100, submissionsOpen: boolean = false): Promise<Festival[]> {
    if (!this.festivals) {
      return this.http.get<FestivalsApiResponse>(`${environment.apiUrl}/festivals?activeOnly=${activeOnly}&pageSize=${pageSize}&submissionsOpen=${submissionsOpen}`)
        .pipe(
          map((response: FestivalsApiResponse) => {
            this.festivals = response.festivals;
            return this.festivals;
          })
        )
        .toPromise();
    } else {
      return Promise.resolve(this.festivals);
    }
  }

  async saveFestival(festival: Festival): Promise<Festival> {
    const response = await this.http.post<Festival>(`${environment.apiUrl}/festivals`, festival).toPromise();
    return response
  }

  async deleteFestival(festival: Festival) {
    await this.http.delete(`${environment.apiUrl}/festivals/${festival.id}`).toPromise();
    const foundIndex = this.festivals.findIndex(f => f.id === festival.id);
    if (foundIndex !== -1) {
      this.festivals.splice(foundIndex, 1);
    }
  }
  
}
