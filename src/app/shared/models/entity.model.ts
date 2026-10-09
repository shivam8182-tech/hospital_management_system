export type EntityType = 'patient' | 'staff' | 'provider' | 'biller';

export interface HospitalEntity {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  role?: string;
  department?: string;
  specialty?: string;
  insurance?: string;
  dob?: string;
  mrn?: string;
  address?: string;
  [key: string]: unknown;
}