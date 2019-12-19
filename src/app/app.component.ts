import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  
  title = 'pos';
  loginStatus: string;

  @ViewChild(LoginComponent, {static: false}) login: any;
 
  constructor(private router: Router,public authService: AuthService) { 
    this.router.navigate(['/login']);
  }
    
// console.log(localStorage.getItem("isLoggedIn"));
// this.loginStatus = localStorage.getItem("isLoggedIn");

  ngAfterViewInit(): void {
    // this.loginStatus = this.login.loginStatus;
  }
}
