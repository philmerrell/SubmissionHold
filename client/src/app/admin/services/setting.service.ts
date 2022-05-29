import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface Festival {
  name: string;
  guidelines: string;
  startDateTime: string;
  endDateTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private http: HttpClient) { }

  getCategories() {
    return [ 'Music', 'Film', 'Comedy', 'Art', 'Tech']
  }

  getFestivals(): any[] {
    return []
  }

  getLabels(): any[] {
    return [
      "Bacon",
      "Black Olives",
      "Extra Cheese",
      "Green Peppers",
      "Mushrooms",
      "Onions",
      "Pepperoni",
      "Pineapple",
      "Sausage",
      "Spinach",
    ]
  }

  saveFestival(festival: Festival): Promise<any> {
    return this.http.post(`${environment.apiUrl}`, festival).toPromise();
  }
}
