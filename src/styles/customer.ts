export type PaymentStatus = 'Paid' | 'Processing' | 'Overdue';

export interface LoanProduct {
    id: string;
    name: string;
    category: string;
    icon: string;
    loanAmount: number;      // Số tiền gốc
    remainingAmount: number; // Dư nợ thực tế
    loanDate: string;
    paymentStatus: PaymentStatus;
    statusLabel: string;
    profit: string;
}

export interface Customer {
    id: string;
    loanCode: string;
    name: string;
    role: string;
    status: string;
    joinedDate: string;
    createdAt: string;
    isVip: boolean;
    avatar: string;
    phone: string;
    email: string;
    metrics: {
        totalBorrowed?: string; // Tự động tính
        currentDebt?: string;   // Tự động tính
        creditScore: string;
    };
    products: LoanProduct[];
    loanCount?: number;
}