
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface LoginResponse {
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  isAuthenticated = signal<boolean>(false);
  
  async login(password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>('/api/login', { password }, { withCredentials: true })
      );

      if (response.success) {
        this.isAuthenticated.set(true);
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  async checkSession(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ authenticated: boolean }>('/api/session', { withCredentials: true })
      );
      this.isAuthenticated.set(response.authenticated);
      return response.authenticated;
    } catch {
      this.isAuthenticated.set(false);
      return false;
    }
  }
}
