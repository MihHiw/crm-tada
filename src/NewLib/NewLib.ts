import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
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


//USER

export interface User {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    avatar_url?: string | null;
    role_id: number;
    balance?: number;
    address?: string;
    note: string;
    is_active: boolean;
    created_at: string;
    updated_at?: string;
}


export const authAPI = {
    register: (data: User) => api.post('/auth/register', data),
    login: (data: User) => api.post('/auth/login', data),
};


export const usersAPI = {
    getAllUser: () => api.get<User[]>('/users'),
    getUserById: (id: string) => api.get<User>(`/users/${id}`),
    createUser: (data: Omit<User, 'id' | 'created_at' | 'is_active'>) => api.post<User>('/users', data),
    updateUser: (id: string, data: Partial<User>) => api.patch<User>(`/users/${id}`, data),
    deleteUser: (id: string) => api.delete<boolean>(`/users/${id}`),

    getProfile: () => api.get('/users/profile'),
    updateProfile: (data: Partial<User>) => api.patch('/users/profile', data),
    getTransactions: (params?: Record<string, unknown>) => api.get('/users/transactions', { params }),
    getReferralLink: () => api.get('/users/referral-link'),
    getReferrals: () => api.get('/users/referrals')
}


export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface UserRole {
    id: number;
    name: string;
    permissions: Json;
    description?: string;
}


export const rolesAPI = {
    getAll: () => api.get<UserRole[]>('/user-roles'),
    getById: (id: number) => api.get<UserRole>(`/user-roles/${id}`),
    create: (data: Omit<UserRole, 'id'>) => api.post<UserRole>('/user-roles', data),
    update: (id: number, data: Partial<UserRole>) => api.patch<UserRole>(`/user-roles/${id}`, data),
    delete: (id: number) => api.delete<boolean>(`/user-roles/${id}`),
};


//Membership

export interface Membership {
    id: string;
    user_id: string;
    rank_id: number;
    card_number: string;
    current_points: number;
    total_spent: number;
    start_date: string;
    end_date?: string;
    is_active: boolean;
}

export const membershipsAPI = {
    getAll: () => api.get<Membership[]>('/memberships'),
    getByUserId: (userId: string) => api.get<Membership>(`/memberships/user/${userId}`),
    create: (data: Omit<Membership, 'id'>) => api.post<Membership>('/memberships', data),
    update: (id: string, data: Partial<Membership>) => api.patch<Membership>(`/memberships/${id}`, data),
};

//Memberrank
export interface MemberRank {
    id: number;
    name: string;
    min_spend: number;
    discount_percent: number;
    icon_url?: string;
}

export const memberranksAPI = {
    getAll: () => api.get<MemberRank[]>('/member-ranks'),
    getByUserId: (userId: string) => api.get<Membership>(`/member-ranks/user/${userId}`),
    update: (id: number, data: Partial<MemberRank>) => api.patch<MemberRank>(`/member-ranks/${id}`, data),
};

//Category
export interface Category {
    id: number;
    name: string;
    description?: string;
    slug?: string;
}

export const categoriesAPI = {
    getAll: () => api.get<Category[]>('/categories'),
    getById: (id: string) => api.get(`/categories/${id}`),
    create: (data: Omit<Category, 'id'>) => api.post<Category>('/categories', data),
    update: (id: number, data: Partial<Category>) => api.patch<Category>(`/categories/${id}`, data),
    delete: (id: number) => api.delete<boolean>(`/categories/${id}`),
};


export interface Service {
    id: string;
    category_id: number;
    name: string;
    description?: string;
    price: number;
    duration_minutes: number;
    image_url?: string;
    is_active: boolean;
}

export const servicesAPI = {
    getAll: (config?: Record<string, unknown>) => api.get('/api/services', config),
    getById: (id: string) => api.get(`/services/${id}`),
    getByCategory: (catId: number) => api.get<Service[]>(`/services/${catId}`),
    create: (data: Omit<Service, 'id'>) => api.post<Service>('/services', data),
    update: (id: string, data: Partial<Service>) => api.patch<Service>(`/services/${id}`, data),
    delete: (id: string) => api.delete<boolean>(`/services/${id}`),
};


//ServicePackage
export interface ServicePackage {
    id: string;
    service_id: string;
    name: string;
    price: number;
    quantity: number;
    validity_days: number;
}

export const servicePackagesAPI = {
    getAll: () => api.get<ServicePackage[]>('/service-packages'),
    create: (data: Omit<ServicePackage, 'id'>) => api.post<ServicePackage>('/service-packages', data),
    update: (id: string, data: Partial<ServicePackage>) => api.patch<ServicePackage>(`/service-packages/${id}`, data),
    delete: (id: string) => api.delete<boolean>(`/service-packages/${id}`),
    getById: (id: string) => api.get(`/service-packages/${id}`),

};

//Booking

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export interface Booking {
    id: string;
    user_id: string;
    staff_id?: string;
    service_id: string;
    start_time: string;
    end_time: string;
    status: BookingStatus;
    total_price: number;
    notes?: string;
    booking_id: string;
    note?: string;
    updated_by: string;
    final_amount: number,
    created_at: string;
}


export const bookingsAPI = {
    getAll: (params?: Record<string, unknown>) => api.get('/bookings', { params }),
    getByUserId: (id: string) => api.get(`/bookings/${id}`),
    create: (data: Booking) => api.post('/bookings', data),
    update: (id: string, data: Partial<Booking>) => api.patch<Booking>(`/bookings/${id}`, data),
    cancel: (id: string) => api.put<Booking>(`/bookings/${id}/cancel`, {}),
    checkAvailability: (params: Record<string, unknown>) => api.get('/bookings/check/availability', { params }),
};


//OperatingDay
export interface OperatingDay {
    id: number;
    day_of_week: number;
    open_time: string;
    close_time: string;
    is_closed: boolean;
}

export const operatingDaysAPI = {
    getAll: () => api.get<OperatingDay[]>('/operating-days'),
    update: (id: number, data: Partial<OperatingDay>) => api.patch<OperatingDay>(`/operating-days/${id}`, data),
};


export interface WorkShift {
    id: string;
    day_id: number;
    date: string;
    start_time: string;
    end_time: string;
    is_available: boolean;
}


export const workShiftsAPI = {
    getAll: () => api.get<WorkShift[]>('/work-shifts'),
    getByDayId: (id: string) => api.get<WorkShift[]>(`/work-shifts/${id}`),
    create: (data: Omit<WorkShift, 'id'>) => api.post<WorkShift>('/work-shifts', data),
    update: (id: string, data: Partial<WorkShift>) => api.patch<WorkShift>(`/work-shifts/${id}`, data),
    delete: (id: string) => api.delete<boolean>(`/work-shifts/${id}`),
};


//Salary
export interface Salary {
    id: string;
    staff_id: string;
    base_salary: number;
    bonus: number;
    deduction: number;
    pay_period_start: string;
    pay_period_end: string;
    status: 'pending' | 'paid';
}


export const salariesAPI = {
    getAll: () => api.get<Salary[]>('/salaries'),
    getByStaff: (staffId: string) => api.get<Salary[]>(`/salaries/${staffId}`),
    create: (data: Omit<Salary, 'id'>) => api.post<Salary>('/salaries', data),
    update: (id: string, data: Partial<Salary>) => api.patch<Salary>(`/salaries/${id}`, data),
};


export type TransactionType = 'deposit' | 'withdrawal' | 'payment' | 'refund' | 'commission';

export interface WalletTransaction {
    id: string;
    user_id: string;
    amount: number;
    type: TransactionType;
    description?: string;
    reference_id?: string;
    status: 'pending' | 'success' | 'failed';
    balance_before?: number;
    balance_after?: number;
    created_at: string;
}

export const walletTransactionsAPI = {
    getAll: () => api.get<WalletTransaction[]>('/wallet-transactions'),
    getByUser: (userId: string) => api.get<WalletTransaction[]>(`/wallet-transactions/${userId}`),
    create: (data: Omit<WalletTransaction, 'id' | 'created_at' | 'status'>) => api.post<WalletTransaction>('/wallet-transactions', data),
};

export type CommissionStatus = 'PENDING' | 'SUCCCESS' | 'FAILED';

export interface Referral {
    id: string;
    referrer_id: string;
    referred_user_id: string;
    commission_amount: number;
    status: CommissionStatus;
    created_at: string;
}

export const referralsAPI = {
    getAll: () => api.get<Referral[]>('/referrals'),
    getByReferrer: (referrerId: string) => api.get<Referral[]>(`/referrals/${referrerId}`),
    create: (data: Omit<Referral, 'id' | 'created_at'>) => api.post<Referral>('/referrals', data),
};


//Promotion
export interface Promotion {
    id: string;
    code: string;
    name: string;
    description?: string;
    banner_url?: string;
    discount_type: 'percent' | 'fixed';
    discount_value: number;
    min_order_value?: number;
    max_discount_value?: number;
    start_date: string;
    end_date: string;
    usage_limit?: number;
    target_type: 'all' | 'specific';
    applicable_users?: string[];
}

export const promotionsAPI = {
    getAll: () => api.get<Promotion[]>('/promotions'),
    checkCode: (code: string) => api.get<Promotion>(`/promotions/check?code=${code}`),
    create: (data: Omit<Promotion, 'id'>) => api.post<Promotion>('/promotions', data),
    update: (id: string, data: Partial<Promotion>) => api.patch<Promotion>(`/promotions/${id}`, data),
    delete: (id: string) => api.delete<boolean>(`/promotions/${id}`),
};


//Consultation
export interface Consultation {
    id: string;
    customer_id: string;
    name: string;
    phone: string;
    email: string;
    service: string
    notes: string;
    source: string;
    images?: string[];
    status: string;
    description?: string;
    note: string;
    created_at: string;
    createdBy?: string;
}
export const consultationsAPI = {
    getAll: () => api.get<Consultation[]>('/consultations'),
    create: (data: Omit<Consultation, 'id' | 'created_at'>) => api.post<Consultation>('/consultations', data),
    updateDetails: (id: string, data: Partial<Consultation>) => api.patch<Consultation>(`/consultations/${id}`, data),
    updateStatus: (id: string, status: string, note: string) => api.patch<boolean>(`/consultations/${id}/status`, { status, note }),
    delete: (id: string) => api.delete<boolean>(`/consultations/${id}`),
};


