
import { Injectable, signal } from '@angular/core';

const AUTH_KEY = 'wedding_auth_token';
const CORRECT_PASSWORD = 'CR2026'; // This should be more secure in a real app

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated = signal<boolean>(this.hasAuthToken());

  private hasAuthToken(): boolean {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem(AUTH_KEY) === 'true';
    }
    return false;
  }
  
  login(password: string): boolean {
    if (password === CORRECT_PASSWORD) {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(AUTH_KEY, 'true');
        this.isAuthenticated.set(true);
        return true;
      }
    }
    return false;
  }
}
