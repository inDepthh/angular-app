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
  items = ["item1", "item2"];

  constructor(private router: Router,public authService: AuthService) { }

  ngOnInit() {
    this.id = localStorage.getItem('token');
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
}
