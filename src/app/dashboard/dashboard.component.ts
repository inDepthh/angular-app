import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  id: string;
  items = [
    ["item1", "item2"],
    ["item3", "item4"]
  ];
  addItem = false;
  contextmenu = false;
  contextmenuX = 0;
  contextmenuY = 0;
  name: string;
  price: string;
  itemDetails = [];



  constructor(private router: Router,public authService: AuthService) { }

  ngOnInit() {
    this.id = localStorage.getItem('token');
  }

  receiveMessage($event) {
    this.itemDetails.push($event);
    this.name = this.itemDetails[0];
    this.price = this.itemDetails[1];
  }

  get getPrice() {
    return this.price;
  }

  public get getName() {
    return this.name;
  }

  //activates the menu with the coordinates
  onrightClick(event){
    this.contextmenuX = event.clientX
    this.contextmenuY = event.clientY
    this.contextmenu = true;
  }

  //disables the menu
  disableContextMenu(){
    this.contextmenu = false;
  }

  logout(): void {
    console.log("Logout"); 
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  addItems(item) {
    this.items.push(item)
  }

  removeItems(index: number) {
    this.items.splice(index, 1)
  }

  showAddItemDialog() {
    this.addItem = true;
  }
}
