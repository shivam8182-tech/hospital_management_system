import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type UserRole = 'admin' | 'staff' | 'provider' | 'patient';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly key = 'hms_auth';
  private readonly loggedInSubject = new BehaviorSubject<boolean>(this.isAuthenticated());

  readonly loggedIn$ = this.loggedInSubject.asObservable();

  private readonly demoAccounts: Record<UserRole, string> = {
    admin: 'Admin@123',
    staff: 'Staff@123',
    provider: 'Provider@123',
    patient: 'Patient@123'
  };

  login(username: string, password: string): boolean {
    // Demo only. Replace with an API call and server-side authentication.
    const role = username.trim().toLowerCase() as UserRole;
    if (role in this.demoAccounts && this.demoAccounts[role] === password) {
      localStorage.setItem(this.key, role);
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
    return this.getRole() !== null;
  }

  getRole(): UserRole | null {
    const role = localStorage.getItem(this.key);
    return role === 'admin' || role === 'staff' || role === 'provider' || role === 'patient'
      ? role
      : null;
  }
}