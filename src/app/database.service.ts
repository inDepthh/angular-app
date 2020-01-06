import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { stringify } from 'querystring';
import { ReplaceSource } from 'webpack-sources';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  pizzaResponse;
  sideResponse;
  drinkResponse;
  editStatus;

  constructor(private http: HttpClient) { }

  dataReciever(edit) {
    this.editStatus = edit;
  }

  getEditStatus() {
    return this.editStatus;
  }

  getPizzaReponse() {
    return this.pizzaResponse;
  }

  getsideReponse() {
    return this.sideResponse;
  }

  getdrinkReponse() {
    return this.drinkResponse;
  }

  URL(productType: string) {
    if (productType === 'Side') {
      return 'http://0.0.0.0:3000/api/Sides';
    } else if (productType === 'Drink') {
      return 'http://0.0.0.0:3000/api/Drinks'
    } else {
      return 'http://localhost:3000/api/Pizzas';
    }
  }

  onCreatePost(product: string, productPrice: string, productType: string, index: number) {

    productPrice = ' ' + productPrice;

    this.http.post(this.URL(productType), { id: index, product: product, price: productPrice })
    .subscribe(responseData => {
        console.log(responseData);
    });
  }

  onFetch() {
    this.fetchPizzas();
    this.fetchSides();
    this.fetchDrinks();
   }

  onDelete(id: number, productType) {
    this.http.delete(this.URL(productType) + "/" + id).subscribe();
  }
  
  private fetchPizzas() {
    this.http.get('http://localhost:3000/api/Pizzas').subscribe(response => {
      this.pizzaResponse = JSON.parse(JSON.stringify(response));
      console.log(response);
    });
  }

  private fetchSides() {
    this.http.get('http://0.0.0.0:3000/api/Sides').subscribe(response => {
      this.sideResponse = JSON.parse(JSON.stringify(response));
      console.log(this.sideResponse);
    });
  }

  private fetchDrinks() {
    this.http.get('http://0.0.0.0:3000/api/Drinks').subscribe(response => {
      this.drinkResponse = JSON.parse(JSON.stringify(response));
      console.log(this.drinkResponse);
    });
  }

  onUpdate(productType, index) {
    this.http.put(this.URL(productType), { id: index } ).subscribe(response => {
      console.log(response);
    });
  }
}
