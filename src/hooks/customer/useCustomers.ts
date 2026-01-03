"use client";
import { CUSTOMERS_DATA } from '@/mocks/customer';
import { useEffect, useState } from 'react';

export type Customer = typeof CUSTOMERS_DATA[0];

export function useCustomers() {
    const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS_DATA);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Hàm bọc để xử lý nhập liệu và bật loading đồng thời
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        if (value !== searchTerm) {
            setLoading(true); // Bật loading tại sự kiện nhập liệu để tránh lỗi useEffect
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            const filtered = CUSTOMERS_DATA.filter(c => {
                const searchLower = searchTerm.toLowerCase();
                return (
                    c.name.toLowerCase().includes(searchLower) ||
                    c.id.includes(searchTerm) ||
                    c.phone.includes(searchTerm) ||
                    c.email.toLowerCase().includes(searchLower)
                );
            });

            setCustomers(filtered);
            setLoading(false);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    return {
        customers,
        loading,
        searchTerm,
        setSearchTerm: handleSearch // Trả về hàm bọc thay vì setState gốc
    };
}