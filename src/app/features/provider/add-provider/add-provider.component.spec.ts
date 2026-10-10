import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProviderComponent } from './add-provider.component';
import { EntityService } from '../../../core/services/entity.service';
import { Router } from '@angular/router';

describe('AddProviderComponent', () => {
  let component: AddProviderComponent;
  let fixture: ComponentFixture<AddProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProviderComponent],
      providers: [
        EntityService,
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('requires valid contact and license information', () => {
    component.providerForm.patchValue({
      phone: '123',
      email: 'not-an-email',
      medicalLicenseNo: '!'
    });
    expect(component.providerForm.get('phone')?.invalid).toBeTrue();
    expect(component.providerForm.get('email')?.invalid).toBeTrue();
    expect(component.providerForm.get('medicalLicenseNo')?.invalid).toBeTrue();
  });
});
