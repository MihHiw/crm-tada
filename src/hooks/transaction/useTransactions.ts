"use client";
import { TRANSACTION_MOCK } from '@/mocks/transaction';
import { useMemo, useState } from 'react';

export function useTransactions() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái');

    const filteredTransactions = useMemo(() => {
        return TRANSACTION_MOCK.filter((item) => {
            const matchesSearch = item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'Tất cả trạng thái' || item.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter]);

    return {
        transactions: filteredTransactions,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter
    };
}