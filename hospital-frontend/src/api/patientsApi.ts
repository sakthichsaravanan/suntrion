import api from './axios';
import { Patient, PatientFormData } from '../types/patient';

export const patientsApi = {
  getAll: async (): Promise<Patient[]> => {
    const response = await api.get('/patients/');
    return response.data;
  },
  getById: async (id: number): Promise<Patient> => {
    const response = await api.get(`/patients/${id}/`);
    return response.data;
  },
  create: async (data: PatientFormData): Promise<Patient> => {
    const response = await api.post('/patients/', data);
    return response.data;
  },
  update: async (id: number, data: Partial<PatientFormData>): Promise<Patient> => {
    const response = await api.patch(`/patients/${id}/`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/patients/${id}/`);
  }
};
