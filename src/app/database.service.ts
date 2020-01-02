import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  // product: string;
  // productPrice: string;
  // productType: string;

  constructor(private http: HttpClient) { }

  // public dataReceiver(product: string, productPrice: string, productType: string) {
  //   this.product = product;
  //   this.productPrice = productPrice;
  //   this.productType = productType;
  // }

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

    // Send Http request
    this.http.post(this.URL(productType), { id: index, product: product, price: productPrice })
    .subscribe(responseData => {
        console.log(responseData);
    });
  }

  onFetch() {
    // Send Http request
    this.fetchPizzas();
    this.fetchSides();
    this.fetchDrinks();
   }

  onDelete(id: number) {
    // Send Http request
    this.http.delete('http://localhost:3000/api/Angulars/' + id).subscribe();
  }
  
  private fetchPizzas() {
    this.http.get('http://localhost:3000/api/Pizzas').subscribe(response => {
      console.log(response);
    });
  }

  private fetchSides() {
    this.http.get('http://0.0.0.0:3000/api/Sides').subscribe(response => {
      console.log(response);
    });
  }

  private fetchDrinks() {
    this.http.get('http://0.0.0.0:3000/api/Drinks').subscribe(response => {
      console.log(response);
    });
  }


  onUpdate(postData: { title: string; content: string; id: number}) {
    this.http.put('http://localhost:3000/api/Angulars', postData).subscribe(response => {
      console.log(response);
    });
  }
}
