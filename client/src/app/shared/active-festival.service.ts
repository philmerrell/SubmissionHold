import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Festival, FestivalsApiResponse } from '../admin/services/admin-festival.service';

@Injectable({
  providedIn: 'root'
})
export class ActiveFestivalService {
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
}
