import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private router: Router, public authService: AuthService) { }

  logout(): void {
    console.log("logout called")
    localStorage.setItem('isLoggedIn', "false");
    localStorage.removeItem('token');
  }
}
