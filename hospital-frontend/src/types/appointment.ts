

export interface Appointment {
  id: number;
  patient: number;
  doctor: number;
  patient_name?: string;
  doctor_name?: string;
  datetime: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  location: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export type AppointmentFormData = Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'patient_name' | 'doctor_name'>;
