import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBillerComponent } from './add-biller.component';
import { EntityService } from '../../../core/services/entity.service';
import { Router } from '@angular/router';

describe('AddBillerComponent', () => {
  let component: AddBillerComponent;
  let fixture: ComponentFixture<AddBillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBillerComponent],
      providers: [
        EntityService,
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('rejects malformed biller IDs, phone numbers, and email addresses', () => {
    component.billerForm.patchValue({
      billerId: '!',
      phone: '123',
      email: 'not-an-email'
    });
    expect(component.billerForm.get('billerId')?.invalid).toBeTrue();
    expect(component.billerForm.get('phone')?.invalid).toBeTrue();
    expect(component.billerForm.get('email')?.invalid).toBeTrue();
  });
});
