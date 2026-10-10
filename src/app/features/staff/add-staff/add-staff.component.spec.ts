import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStaffComponent } from './add-staff.component';
import { EntityService } from '../../../core/services/entity.service';
import { Router } from '@angular/router';

describe('AddStaffComponent', () => {
  let component: AddStaffComponent;
  let fixture: ComponentFixture<AddStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStaffComponent],
      providers: [
        EntityService,
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('rejects invalid phone numbers and staff IDs', () => {
    component.staffForm.patchValue({ phone: '123', staffId: '!' });
    expect(component.staffForm.get('phone')?.invalid).toBeTrue();
    expect(component.staffForm.get('staffId')?.invalid).toBeTrue();
  });
});
