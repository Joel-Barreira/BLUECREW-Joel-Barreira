import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

export interface UserInfo {
  id?: number;
  username: string;
  nombre?: string;
  roles: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService {
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    super();
  }

  public get currentUserValue(): UserInfo | null {
    return this.currentUserSubject.value;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private getStoredUser(): UserInfo | null {
    if (!this.isBrowser()) return null;
    
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, credentials, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response && response.user) {
            const userInfo: UserInfo = {
              id: response.id,
              username: response.user,
              nombre: response.nombre,
              roles: response.roles
            };
            if (this.isBrowser()) {
              localStorage.setItem('currentUser', JSON.stringify(userInfo));
            }
            this.currentUserSubject.next(userInfo);
          }
        })
      );
  }

  logout(): void {
    // We send the logout request to invalidate session in backend
    this.http.post(`${this.baseUrl}/auth/logout`, {}, { withCredentials: true }).subscribe({
      next: () => this.clearLocalSession(),
      error: () => this.clearLocalSession()
    });
  }

  private clearLocalSession(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  isAdmin(): boolean {
    const user = this.currentUserValue;
    if (!user) return false;
    
    // El backend devuelve roles como "[ROLE_ADMIN]" o "ROLE_ADMIN"
    return user.roles.includes('ADMIN');
  }
}
