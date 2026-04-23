import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/api.model';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'yc_token';
  private readonly ADMIN_KEY = 'yc_admin';
  private readonly TOKEN_EXPIRY_KEY = 'yc_token_expiry';

  isLoggedIn = signal(this.hasValidToken());
  currentAdmin = signal<LoginResponse | null>(this.getStoredAdmin());

  constructor(private http: HttpClient, private router: Router) {
    // Check token expiry on service initialization
    this.checkTokenExpiry();
  }

  login(req: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    // Use /auth/login endpoint - proxy will route to backend
    const url = environment.apiUrl ? `${environment.apiUrl}/auth/login` : '/auth/login';
    return this.http.post<ApiResponse<LoginResponse>>(url, req).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.storeTokenSecurely(res.data.token);
          sessionStorage.setItem(this.ADMIN_KEY, JSON.stringify(res.data));
          this.isLoggedIn.set(true);
          this.currentAdmin.set(res.data);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    sessionStorage.removeItem(this.ADMIN_KEY);
    this.isLoggedIn.set(false);
    this.currentAdmin.set(null);
    this.router.navigate(['/admin/login']);
  }

  getToken(): string | null {
    if (!this.hasValidToken()) {
      this.logout();
      return null;
    }
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private storeTokenSecurely(token: string): void {
    // Store token in localStorage (consider httpOnly cookies for production)
    localStorage.setItem(this.TOKEN_KEY, token);
    
    // Calculate and store expiry time (1 hour from now)
    const expiryTime = Date.now() + (60 * 60 * 1000); // 1 hour
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    
    if (!token || !expiry) {
      return false;
    }
    
    // Check if token is expired
    if (Date.now() > parseInt(expiry)) {
      this.logout();
      return false;
    }
    
    return true;
  }

  private checkTokenExpiry(): void {
    // Check token expiry every minute
    setInterval(() => {
      if (!this.hasValidToken() && this.isLoggedIn()) {
        this.logout();
      }
    }, 60000);
  }

  private getStoredAdmin(): LoginResponse | null {
    const s = sessionStorage.getItem(this.ADMIN_KEY);
    return s ? JSON.parse(s) : null;
  }
}
