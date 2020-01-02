import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { DatabaseService } from '../database.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  pizzas = [['Sm Pizza', ' $6'], ['Md Pizza', ' $8'], ['Lg Pizza', ' $10']];
  sides = [['Garlic Bread', ' $4'], ['Sm Sub', ' $6'], ['Lg Sub', ' $8']];
  drinks = [['Mnt dew', ' $2'], ['Coke', ' $2'], ['Sunkist', ' $2'], ['Sprite', ' $2']];
  id: string;
  checkouts = [];
  addItem = false;
  contextmenu = false;
  contextmenuX = 0;
  contextmenuY = 0;
  name: string;
  price: string;
  itemType: string;
  itemDetails = [];
  count = 0;
  index: number;
  pizza: boolean;
  side: boolean;
  drink: boolean;
  checkout: boolean;
  total = 0;
  prices = 0;
  currentIndex;

  constructor(private router: Router, public authService: AuthService, 
    public databaseService: DatabaseService, public http: HttpClient) { }

  ngOnInit() {
    this.id = localStorage.getItem('token');
    this.databaseService.onFetch();
  }

  totalPrice(remove: boolean, index) {
    let tempPrice = '0';

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.checkouts.length; ++i) {
      tempPrice = this.checkouts[i][1].toString();
      tempPrice = tempPrice.slice(2, tempPrice.length);
      this.prices = +tempPrice;
    }

    if (!remove) {
      this.total += this.prices;
    } else {
      this.currentIndex = this.checkouts[+index][1];
      this.total -= +this.currentIndex.slice(2, this.currentIndex.length);
    }
  }

  receiveMessage($event: any) {
    this.count++;
    this.itemDetails.push($event);
    this.name = this.itemDetails[0];
    this.price = this.itemDetails[1];
    this.itemType = this.itemDetails[2];

    // this.databaseService.dataReceiver(this.name, this.price, this.itemType);

    if ($event === 'dismiss') {
      this.closeAddItemDialog();
      this.clearList();
      return;
    }

    if (this.count === 3) {
      this.count = 0;
      this.addItems();
      this.clearList();
    }
    this.closeAddItemDialog();
  }

  receiveMsgDelete($event: any) {
    this.totalPrice(true, $event);
    this.removeItems($event);
  }

  addToCheckout(array: any) {
    this.checkouts.push(array);
    this.totalPrice(false, null);
  }

  closeAddItemDialog() {
    this.addItem = false;
  }

  onRightClickPizza(event, index: number) {
    this.onrightClick(event, index);
    this.pizza = true;
  }

  onRightClickSide(event, index: number) {
    this.onrightClick(event, index);
    this.side = true;
  }

  onRightClickDrink(event, index: number) {
    this.onrightClick(event, index);
    this.drink = true;
  }

  onRightClickCheckout(event, index: number) {
    this.onrightClick(event, index);
    this.checkout = true;
  }

  // activates the menu with the coordinates
  onrightClick(event, index: number) {
    this.contextmenuX = event.clientX;
    this.contextmenuY = event.clientY;
    this.contextmenu = true;
    this.index = index;
  }

  // disables the menu
  disableContextMenu() {
    this.contextmenu = false;
  }

  logout(): void {
    console.log('Logout');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  addItems() {
    if (this.price[0] !== '$') {
      this.price = '$' + this.price;
    }

    if (this.itemType === 'Pizza') {
      this.pizzas.push([this.name, ' ' + this.price]);
      this.index = this.pizzas.length;
    } else if (this.itemType === 'Side') {
      this.sides.push([this.name, ' ' + this.price]);
      this.index = this.sides.length;
    } else if (this.itemType === 'Drink') {
      this.index = this.drinks.length;
      this.drinks.push([this.name, ' ' + this.price]);
    }
    this.databaseService.onCreatePost(this.name, this.price, this.itemType, this.index);
  }

  removeItems(index: any) {
    if (index === typeof String) {
      index = +index;
    }

    if (this.pizza) {
      this.pizzas.splice(index, 1);
      this.pizza = false;
    } else if (this.side) {
      this.sides.splice(index, 1);
      this.side = false;
    } else if (this.drink) {
      this.drinks.splice(index, 1);
      this.drink = false;
    } else if (this.checkout) {
      this.checkouts.splice(index, 1);
      this.checkout = false;
    }
  }

  showAddItemDialog() {
    this.addItem = true;
  }

  clearList() {
    this.itemDetails.splice(0, this.itemDetails.length);
  }
}