import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  it('allows authenticated users', () => {
    localStorage.setItem('hms_auth', 'admin');
    TestBed.configureTestingModule({
      providers: [AuthService, Router]
    });
    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
    expect(result).toBeTrue();
    localStorage.removeItem('hms_auth');
  });
});