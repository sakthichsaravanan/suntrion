import api from './axios';
import { Doctor, DoctorFormData } from '../types/doctor';

export const doctorsApi = {
  getAll: async (): Promise<Doctor[]> => {
    const response = await api.get('/doctors/');
    return response.data;
  },
  getById: async (id: number): Promise<Doctor> => {
    const response = await api.get(`/doctors/${id}/`);
    return response.data;
  },
  create: async (data: DoctorFormData): Promise<Doctor> => {
    const response = await api.post('/doctors/', data);
    return response.data;
  },
  update: async (id: number, data: Partial<DoctorFormData>): Promise<Doctor> => {
    const response = await api.patch(`/doctors/${id}/`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/doctors/${id}/`);
  }
};
