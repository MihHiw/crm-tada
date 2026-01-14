"use client";
import { CUSTOMERS_DATA } from '@/mocks/customer';
import { useEffect, useState } from 'react';

// 1. Định nghĩa Interface chi tiết hơn cho Product
interface Product {
    id: string;
    loanAmount: number; // Phải là number để tính toán
    remainingAmount: number; // Thêm trường này để biết dư nợ thực tế
    loanDate: string;
    [key: string]: any;
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
        totalLoan?: string;   // Tổng tiền đã vay từ trước đến nay
        currentDebt?: string; // Dư nợ thực tế hiện tại
        creditScore: string;
    };
    products: Product[];
    loanCount?: number;
}

// Hàm format tiền tệ giữ nguyên logic cũ
const formatCurrency = (amount: number): string => {
    if (amount >= 1000000000) {
        return `${(amount / 1000000000).toFixed(1)} Tỷ đ`;
    }
    if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(0)} Triệu đ`;
    }
    return `${amount.toLocaleString('vi-VN')} đ`;
};

export function useCustomers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setLoading(true);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            const searchLower = searchTerm.toLowerCase().trim();

            // 1. Lọc dữ liệu (Giữ nguyên logic của bạn)
            const filtered = CUSTOMERS_DATA.filter(c =>
                c.name.toLowerCase().includes(searchLower) ||
                c.id.includes(searchTerm) ||
                c.loanCode.toLowerCase().includes(searchLower) ||
                c.phone.includes(searchTerm) ||
                c.email.toLowerCase().includes(searchLower)
            );

            // 2. Tính toán LOGIC TỔNG TIỀN VÀ DƯ NỢ THỰC TẾ
            const enrichedData = filtered.map(customer => {
                // Tính tổng số tiền GỐC đã vay
                const totalBorrowed = customer.products 
                    ? customer.products.reduce((sum, p) => sum + (p.loanAmount || 0), 0) 
                    : 0;

                // Tính tổng số DƯ NỢ thực tế còn lại (khoản chưa trả xong)
                const totalDebt = customer.products
                    ? customer.products.reduce((sum, p) => sum + (p.remainingAmount || 0), 0)
                    : 0;

                return {
                    ...customer,
                    loanCount: customer.products ? customer.products.length : 0,
                    metrics: {
                        ...customer.metrics,
                        // Trả về cả 2 thông số để hiển thị minh bạch
                        totalLoan: formatCurrency(totalBorrowed),
                        currentDebt: formatCurrency(totalDebt)
                    }
                };
            });

            setCustomers(enrichedData);
            setLoading(false);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    return {
        customers,
        loading,
        searchTerm,
        setSearchTerm: handleSearch
    };
}