import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { DatabaseService } from '../database.service';
import { HttpClient } from '@angular/common/http';
import { timingSafeEqual } from 'crypto';
import { ArrayType } from '@angular/compiler';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // pizzas = [['Sm Pizza', ' $6'], ['Md Pizza', ' $8'], ['Lg Pizza', ' $10']];
  // sides = [['Garlic Bread', ' $4'], ['Sm Sub', ' $6'], ['Lg Sub', ' $8']];
  // drinks = [['Mnt dew', ' $2'], ['Coke', ' $2'], ['Sunkist', ' $2'], ['Sprite', ' $2']];
  pizzas;
  sides;
  drinks;
  id: string;
  checkouts = [];
  addItem = false;
  contextmenu = false;
  contextmenuX = 0;
  contextmenuY = 0;
  itemType: string;
  index: number;
  total = 0;
  count = 0;
  name;
  price;
  itemDetails = [];
  checkoutDelete: boolean;

  constructor(private router: Router, public authService: AuthService, 
    public databaseService: DatabaseService, public http: HttpClient) { }

  ngOnInit() {
    this.id = localStorage.getItem('token');
    this.fetchData();
  }

  fetchData() {
    this.databaseService.onFetch();

    setTimeout(() => {
      this.pizzas = this.databaseService.getPizzaResponse();
      this.sides = this.databaseService.getSideResponse();
      this.drinks = this.databaseService.getDrinkResponse();
    }, 150);
  }

  totalPrice(remove: boolean, index) {
    let tempPrice = '0';
    let price = 0;
  
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.checkouts.length; ++i) {
      tempPrice = this.checkouts[i][1].toString();
      tempPrice = tempPrice.slice(2, tempPrice.length);
      price = +tempPrice;
    }

    if (!remove) {
      this.total += price;
    } else {
      let currentIndex = this.checkouts[+index][1];
      this.total -= +currentIndex.slice(2, currentIndex.length);
    }
  }

  receiveMessage($event: any) {
    this.count++
    this.itemDetails.push($event);
    this.name = this.itemDetails[0];
    this.price = this.itemDetails[1];
    console.log(this.price);
    this.itemType = this.itemDetails[2];

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

  receiveMsgContextMenu($event: any) {
    if (this.databaseService.getEditStatus()) {
      console.log("Edit was pressed");
      this.addItem = true;
      this.databaseService.setIndex($event);
      this.databaseService.setItemType(this.itemType);
    } else if (this.checkoutDelete){
      this.totalPrice(true, $event);
      this.removeCheckoutItems($event);
      console.log("Delete was pressed");
    } else {
      this.onCheckoutDelete($event);
    }
  }

  onCheckoutDelete(event: any) {
    console.log("delete");
      this.databaseService.onDelete(event, this.itemType);
      setTimeout(() => {
        this.fetchData();
      }, 100);
      
    //   let value: number;
    //   let next: number;
    // for (let item of this.arrayType()) {
    //   console.log(item.id)
    //   value = item.id;
    //   next = value + 1;
    //   console.log(next);
    //   if (value === next - 1) {
    //     console.log("Error found. item id: " + value + " next item: " + next);
    //   }
    // }
  }

  arrayType() {
      if (this.itemType === 'Pizza') {
        return this.pizzas;
      } else if (this.itemType === 'Side') {
        return this.sides;
      } else {
        return this.drinks;
      }
  }

  addToCheckout(array: any) {
    this.checkouts.push([array.product, array.price]);
    this.totalPrice(false, null);
  }

  closeAddItemDialog() {
    this.addItem = false;
  }

  onRightClickPizza(event, index: number) {
    this.onrightClick(event, index);
    this.itemType = "Pizza";
    this.checkoutDelete = false;
  }

  onRightClickSide(event, index: number) {
    this.onrightClick(event, index);
    this.itemType = "Side";
    this.checkoutDelete = false;
  }

  onRightClickDrink(event, index: number) {
    this.onrightClick(event, index);
    this.itemType = "Drink";
    this.checkoutDelete = false;
  }

  onRightClickCheckout(event, index: number) {
    this.onrightClick(event, index);
    this.checkoutDelete = true;
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
    console.log(this.price);
    if (this.price[0] !== '$') {
      this.price = '$' + this.price;
    }

    if (this.itemType === 'Pizza') {
      this.index = this.pizzas.length;
    } else if (this.itemType === 'Side') {
      this.index = this.sides.length;
    } else if (this.itemType === 'Drink') {
      this.index = this.drinks.length;
    }
    this.databaseService.onCreatePost(this.name, this.price, this.itemType, this.index);

    setTimeout(() => {
      this.fetchData();
    }, 100);
  }

  removeCheckoutItems(index: any) {
    if (index === typeof String) {
      index = +index;
    }

    if (this.checkoutDelete) {
      this.checkouts.splice(index, 1);
      this.checkoutDelete = false;
    }
  }

  showAddItemDialog() {
    this.addItem = true;
  }

  clearList() {
   this.itemDetails.splice(0, this.itemDetails.length);
  }
}