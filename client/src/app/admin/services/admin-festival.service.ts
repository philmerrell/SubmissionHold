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
}

interface FestivalsApiResponse {
  pageSize: number;
  paginationKey: string;
  festivals: Festival[]
}

@Injectable({
  providedIn: 'root'
})
export class AdminFestivalService {
  activeFestival: Festival;
  festivals: Festival[];

  constructor(private http: HttpClient) { }

  getActiveFestival(): Promise<Festival> {
    if (!this.activeFestival) {
      return this.http.get<FestivalsApiResponse>(`${environment.apiUrl}/festivals?activeOnly=true&pageSize=1`)
        .pipe(
          map((response: FestivalsApiResponse) => {
            this.activeFestival = response.festivals[0] || {} as Festival;
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

  getFestivals(activeOnly: boolean = false, pageSize: number = 100): Promise<Festival[]> {
    if (!this.festivals) {
      return this.http.get<FestivalsApiResponse>(`${environment.apiUrl}/festivals?activeOnly=${activeOnly}&pageSize=${pageSize}`)
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

  saveFestival(festival: Festival): Promise<any> {
    return this.http.post(`${environment.apiUrl}/festivals`, festival).toPromise();
  }

  deleteFestival(festival: Festival) {
    return this.http.delete(`${environment.apiUrl}/festivals/${festival.id}`).toPromise();
  }
  
}
