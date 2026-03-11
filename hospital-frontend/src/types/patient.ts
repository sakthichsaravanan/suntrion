export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone_number: string;
  created_at?: string;
  updated_at?: string;
}

export type PatientFormData = Omit<Patient, 'id' | 'created_at' | 'updated_at'>;
