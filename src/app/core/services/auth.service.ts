import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly key = 'hms_auth';
  private readonly loggedInSubject = new BehaviorSubject<boolean>(this.isAuthenticated());

  readonly loggedIn$ = this.loggedInSubject.asObservable();

  login(username: string, password: string): boolean {
    // Demo only. Replace with an API call and server-side authentication.
    if (username === 'admin' && password === 'Admin@123') {
      localStorage.setItem(this.key, 'true');
      this.loggedInSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.key);
    this.loggedInSubject.next(false);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(this.key) === 'true';
  }
}