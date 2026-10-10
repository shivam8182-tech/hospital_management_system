import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;

  beforeEach(async () => {
    localStorage.removeItem('hms_auth');
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        AuthService,
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => localStorage.removeItem('hms_auth'));

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('signs in a staff demo account and opens the dashboard', () => {
    component.loginForm.patchValue({
      username: 'staff',
      password: 'Staff@123'
    });
    component.submit();
    expect(localStorage.getItem('hms_auth')).toBe('staff');
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});