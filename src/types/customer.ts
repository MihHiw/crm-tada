
export interface Customer {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    avatar_url?: string | null;
    role_id: number;
    balance?: number;
    is_active: boolean;
    address?: string;
    note?: string;
    created_at: string;
    updated_at?: string;
    referralCode?: string;
}

// 2. Định nghĩa Stats
export interface CustomerStats {
    totalSpent: number;
    visitCount: number;
    lastVisit: string | null;
    walletBalance: number;
    upcomingBookings: number;
}

export interface ServiceHistoryItem {
    id: string;
    date: string;
    service_name: string;
    staff_name: string;
    price: number;
    status: string;
}

export interface TransactionHistoryItem {
    id: string;
    date: string;
    amount: number;
    type: string;
    description: string;
    status: string;
}