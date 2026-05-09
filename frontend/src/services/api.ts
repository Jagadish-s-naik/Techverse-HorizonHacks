import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
console.log('API_BASE_URL being used:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'ngrok-skip-browser-warning': '69420',
  },
});

export const farmerService = {
  createProfile: (data: any) => api.post('/farmers', data),
  getProfile: (id: string) => api.get(`/farmers/${id}`),
  updateProfile: (id: string, data: any) => api.patch(`/farmers/${id}`, data),
};

export const forecastService = {
  getLatest: (crop: string, mandi: string, farmerId?: string | null) => 
    api.get(`/forecasts?crop=${crop.toLowerCase()}&mandi=${mandi.toLowerCase()}${farmerId ? `&farmerId=${farmerId}` : ''}`),
  getHistory: (crop: string, mandi: string) => 
    api.get(`/forecasts/history?crop=${crop.toLowerCase()}&mandi=${mandi.toLowerCase()}`),
};

export const communityService = {
  getSignal: (crop: string, district: string) => 
    api.get(`/community?crop=${crop.toLowerCase()}&district=${district.toLowerCase()}`),
};

export default api;
