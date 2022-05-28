import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor() { }

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
}
