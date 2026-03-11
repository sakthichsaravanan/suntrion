import api from './axios';

export const authApi = {
  login: async (credentials: any) => {
    const response = await api.post('/token/', credentials);
    return response.data;
  },
  decodeToken: async (token: string) => {
    const response = await api.post('/token/decode/', { token });
    return response.data;
  }
};
