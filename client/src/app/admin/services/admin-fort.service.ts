import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Festival } from './admin-festival.service';

export interface Fort {
  id: string;
  name: string;
}

interface FortsApiResponse {
  pageSize: number;
  paginationKey: string;
  forts: Fort[]
}

@Injectable({
  providedIn: 'root'
})
export class AdminFortService {
  fortsMap = {};
  constructor(private http: HttpClient) { }

  getForts(id: string): Promise<Fort[]> {
    if (!this.fortsMap[id]) {
      return this.http.get<FortsApiResponse>(`${environment.apiUrl}/festivals/${id}/forts?pageSize=100`)
        .pipe(
          map((response: FortsApiResponse) => {
            this.fortsMap[id] = response.forts;
            return this.fortsMap[id] as Fort[];
          })
        ).toPromise();
    } else {
      return Promise.resolve(this.fortsMap[id]);
    }
  }

  async createFort(id: string, name: {name: string}) {
    const response = await this.http.post<Fort>(`${environment.apiUrl}/festivals/${id}/forts`, name).toPromise();
    return response;
  }

  async deleteFort(festival: Festival, fort: Fort) {
    return this.http.delete(`${environment.apiUrl}/festivals/${festival.id}/forts/${fort.id}`).toPromise();
  }


}
