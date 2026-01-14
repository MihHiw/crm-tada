import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- 1. ĐỊNH NGHĨA CÁC INTERFACES DỮ LIỆU ---
interface AuthPayload {
  phone?: string;
  email?: string;
  password?: string;
  name?: string;
}

export interface BookingPayload {
  serviceId: string | number;
  date?: string;      // Có thể để optional nếu bạn dùng startTime
  time?: string;      // Có thể để optional nếu bạn dùng startTime
  startTime?: string; // Thêm trường này
  sessions: number;   // Thêm trường này
  boxId?: string | number;
  promotionCode?: string;
}

interface PaymentPayload {
  amount: number;
  method?: string;
  bankInfo?: Record<string, unknown>; 
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (config.headers && !config.headers['x-business-code']) {
        config.headers['x-business-code'] = 'VANILA001';
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/register';
      }
    }
    return Promise.reject(error);
  }
);


export const authAPI = {
  register: (data: AuthPayload) => api.post('/auth/register', data),
  login: (data: AuthPayload) => api.post('/auth/login', data),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: Partial<AuthPayload>) => api.patch('/users/profile', data),
  getTransactions: (params?: Record<string, unknown>) => api.get('/users/transactions', { params }),
  getReferralLink: () => api.get('/users/referral-link'),
  getReferrals: () => api.get('/users/referrals'),
};

export const serviceAPI = {
  getAll: (config?: Record<string, unknown>) => api.get('/api/services', config),
  getById: (id: string) => api.get(`/services/${id}`),
};

export const boxAPI = {
  getAll: () => api.get('/boxes'),
  getById: (id: string) => api.get(`/boxes/${id}`),
};

export const bookingAPI = {
  create: (data: BookingPayload) => api.post('/bookings', data),
  getAll: (params?: Record<string, unknown>) => api.get('/bookings', { params }),
  getById: (id: string) => api.get(`/bookings/${id}`),
  cancel: (id: string) => api.patch(`/bookings/${id}/cancel`),
  checkAvailability: (params: Record<string, unknown>) => api.get('/bookings/check/availability', { params }),
};

export const paymentAPI = {
  createDeposit: (data: PaymentPayload) => api.post('/api/payments/deposit', data),
  createWithdrawal: (data: PaymentPayload) => api.post('/payments/withdrawal', data),
  getHistory: (params?: Record<string, unknown>) => api.get('payments/history', { params }),
};

export const promotionAPI = {
  getAll: (config?: Record<string, unknown>) => api.get('/promotions', config),
  getById: (id: string) => api.get(`/promotions/${id}`),
  validate: (code: string) => api.get(`/promotions/validate/${code}`),
};

export const notificationAPI = {
  getAll: (params?: Record<string, unknown>) => api.get('/notifications', { params }),
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
};

export const businessAPI = {
  getInfo: () => api.get('/business'),
  getConfig: (config?: Record<string, unknown>) => api.get('/business-config', config),
};

export default api;