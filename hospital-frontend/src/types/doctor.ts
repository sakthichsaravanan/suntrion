export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  phone_number: string;
  created_at?: string;
  updated_at?: string;
}

export type DoctorFormData = Omit<Doctor, 'id' | 'created_at' | 'updated_at'>;
