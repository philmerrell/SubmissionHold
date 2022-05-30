import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private http: HttpClient) { }

  getCategories() {
    return [ 'Music', 'Film', 'Comedy', 'Art', 'Tech']
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
}
