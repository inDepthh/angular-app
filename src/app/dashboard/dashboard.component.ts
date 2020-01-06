import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { DatabaseService } from '../database.service';
import { HttpClient } from '@angular/common/http';
import { MenuStatus } from '../menu-status.enum';

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
  deleteCheckout: boolean;
  total = 0;
  count = 0;
  name;
  price;
  itemDetails = [];


  constructor(private router: Router, public authService: AuthService, 
    public databaseService: DatabaseService, public http: HttpClient) { }

  ngOnInit() {
    this.id = localStorage.getItem('token');
    this.fetchData();
  }

  fetchData() {
    this.databaseService.onFetch();

    setTimeout(() => {
      this.pizzas = this.databaseService.getPizzaReponse();
      this.sides = this.databaseService.getsideReponse();
      this.drinks = this.databaseService.getdrinkReponse();
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

  receiveMsgContextMenu($event: any) {

    if (this.databaseService.getEditStatus()) {
      console.log("Edit was pressed");
      this.databaseService.dataReciever(false)
      this.addItem = true;
      // this.databaseService.onUpdate(this.itemType, $event);
    } else {
      this.totalPrice(true, $event);
      //this.removeItems($event);
      console.log("Delete was pressed");
    }
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
    this.itemType = "Pizza";
  }

  onRightClickSide(event, index: number) {
    this.onrightClick(event, index);
    this.itemType = "Side";
  }

  onRightClickDrink(event, index: number) {
    this.onrightClick(event, index);
    this.itemType = "Drink";
  }

  onRightClickCheckout(event, index: number) {
    this.onrightClick(event, index);
    // this.delete = true;
    MenuStatus.CheckoutDelete;
    console.log(MenuStatus);
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

  removeItems(index: any) {
    if (index === typeof String) {
      index = +index;
    }

    if (this.deleteCheckout) {
      this.checkouts.splice(index, 1);
      this.deleteCheckout = false;
    }
    this.databaseService.onDelete(index, this.itemType)

    setTimeout(() => {
      this.fetchData();
    }, 100);
  }

  showAddItemDialog() {
    this.addItem = true;
  }

  clearList() {
   this.itemDetails.splice(0, this.itemDetails.length);
  }
}