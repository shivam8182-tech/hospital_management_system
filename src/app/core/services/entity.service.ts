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

  private readonly added: Record<EntityType, HospitalEntity[]> = {
    patient: [],
    staff: [],
    provider: [],
    biller: []
  };
  private readonly loadErrors: Partial<Record<EntityType, string>> = {};

  constructor() {
    for (const type of Object.keys(this.data) as EntityType[]) {
      try {
        const stored = localStorage.getItem(this.storageKey(type));
        if (!stored) continue;

        const parsed: unknown = JSON.parse(stored);
        if (!Array.isArray(parsed) || !parsed.every(this.isHospitalEntity)) {
          throw new Error(`Saved ${type} records are invalid. Clear this browser's ${type} records and try again.`);
        }

        this.added[type] = parsed;
        this.data[type] = [...this.data[type], ...parsed];
      } catch (error) {
        this.loadErrors[type] = error instanceof Error
          ? error.message
          : `Unable to load saved ${type} records from this browser.`;
      }
    }
  }

  getAll(type: EntityType): Observable<HospitalEntity[]> {
    this.throwIfLoadFailed(type);
    return of(this.data[type].map(entity => ({ ...entity })));
  }

  getById(
    type: EntityType,
    id: string
  ): Observable<HospitalEntity | undefined> {
    this.throwIfLoadFailed(type);
    return of(this.data[type].find(item => item.id === id));
  }

  addPatient(patient: HospitalEntity): void {
    this.addEntity('patient', patient);
  }

  addEntity(type: EntityType, entity: HospitalEntity): void {
    this.throwIfLoadFailed(type);
    const records = this.data[type];
    const identifierField = type === 'patient'
      ? 'mrn'
      : type === 'staff'
        ? 'staffId'
        : type === 'provider'
          ? 'providerId'
          : 'billerId';
    const identifier = String(entity[identifierField] ?? '').trim().toLowerCase();

    if (records.some(record => record.id === entity.id)) {
      throw new Error(`A ${type} with this ID already exists.`);
    }
    if (identifier && records.some(record =>
      String(record[identifierField] ?? '').trim().toLowerCase() === identifier
    )) {
      throw new Error(`A ${type} with this ${identifierField} already exists.`);
    }
    if (records.some(record => record.email.trim().toLowerCase() === entity.email.trim().toLowerCase())) {
      throw new Error(`A ${type} with this email address already exists.`);
    }

    const updated = [...this.added[type], entity];
    localStorage.setItem(this.storageKey(type), JSON.stringify(updated));
    this.added[type] = updated;
    records.push(entity);
  }

  mrnExists(mrn: string): boolean {
    return this.data.patient.some(
      patient => patient.mrn?.toLowerCase() === mrn.toLowerCase()
    );
  }

  private storageKey(type: EntityType): string {
    return `hms_entities_${type}`;
  }

  private throwIfLoadFailed(type: EntityType): void {
    const error = this.loadErrors[type];
    if (error) throw new Error(error);
  }

  private isHospitalEntity(value: unknown): value is HospitalEntity {
    if (typeof value !== 'object' || value === null) return false;
    const entity = value as Record<string, unknown>;
    return typeof entity['id'] === 'string'
      && typeof entity['name'] === 'string'
      && typeof entity['email'] === 'string'
      && typeof entity['phone'] === 'string'
      && (entity['status'] === 'Active' || entity['status'] === 'Inactive');
  }
}