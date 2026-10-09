import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import {
  EntityType,
  HospitalEntity
} from '../../shared/models/entity.model';

import hospitalData from '../../Database/hospital_management_data.json';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  private readonly data: Record<EntityType, HospitalEntity[]> = {
    patient: hospitalData.patient as HospitalEntity[],
    staff: hospitalData.staff as HospitalEntity[],
    provider: hospitalData.provider as HospitalEntity[],
    biller: hospitalData.biller as HospitalEntity[]
  };

  getAll(type: EntityType): Observable<HospitalEntity[]> {
    return of([...this.data[type]]);
  }

  getById(
    type: EntityType,
    id: string
  ): Observable<HospitalEntity | undefined> {
    return of(this.data[type].find(item => item.id === id));
  }

  addPatient(patient: HospitalEntity): void {
    this.data.patient.push(patient);
  }

  mrnExists(mrn: string): boolean {
    return this.data.patient.some(
      patient => patient.mrn?.toLowerCase() === mrn.toLowerCase()
    );
  }
}