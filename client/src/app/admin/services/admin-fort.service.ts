import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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
    const response = await this.http.post<FortsApiResponse>(`${environment.apiUrl}/festivals/${id}/forts`, name).toPromise();
    return response;
  }


}
