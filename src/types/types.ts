
export type CommissionStatus = 'PENDING' | 'CONTACTED' | 'UNREACHABLE' | 'APPOINTMENT' | 'SUCCESS' | 'CANCELLED' | 'COMPLETED';

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export type TransactionType = 'deposit' | 'withdrawal' | 'payment' | 'refund' | 'commission';

export type UserRoleType = 'admin' | 'staff' | 'manager' | 'customer';

export type ConsultationStatus =
    | 'PENDING'
    | 'CONTACTED'
    | 'UNREACHABLE'
    | 'APPOINTMENT'
    | 'SUCCESS'
    | 'CANCELLED';


export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];


export interface User {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    avatar_url?: string | null;
    role_id: number;
    is_active: boolean;
    created_at: string;
    updated_at?: string;
}

export interface UserRole {
    id: number;
    name: string;
    permissions: Json;
    description?: string;
}


export interface MemberRank {
    id: number;
    name: string;
    min_spend: number;
    discount_percent: number;
    icon_url?: string;
}

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

export interface Category {
    id: number;
    name: string;
    description?: string;
    slug?: string;
}

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

export interface ServicePackage {
    id: string;
    service_id: string;
    name: string;
    price: number;
    quantity: number;
    validity_days: number;
}

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

// --- OPERATION & STAFF ---

export interface WorkShift {
    id: string;
    day_id: number;
    date: string;
    start_time: string;
    end_time: string;
    is_available: boolean;
}

export interface OperatingDay {
    id: number;
    day_of_week: number;
    open_time: string;
    close_time: string;
    is_closed: boolean;
}

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

export interface Referral {
    id: string;
    referrer_id: string;
    referred_user_id: string;
    commission_amount: number;
    status: CommissionStatus;
    created_at: string;
}

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
    status: ConsultationStatus;
    description?: string;
    note: string;
    created_at: string;
    createdBy?: string;
}

