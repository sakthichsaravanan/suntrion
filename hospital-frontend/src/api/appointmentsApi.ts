import api from './axios';
import { Appointment, AppointmentFormData } from '../types/appointment';

export const appointmentsApi = {
  getAll: async (): Promise<Appointment[]> => {
    const response = await api.get('/appointments/');
    return response.data;
  },
  getById: async (id: number): Promise<Appointment> => {
    const response = await api.get(`/appointments/${id}/`);
    return response.data;
  },
  create: async (data: AppointmentFormData): Promise<Appointment> => {
    const response = await api.post('/appointments/', data);
    return response.data;
  },
  update: async (id: number, data: Partial<AppointmentFormData>): Promise<Appointment> => {
    const response = await api.patch(`/appointments/${id}/`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/appointments/${id}/`);
  }
};
