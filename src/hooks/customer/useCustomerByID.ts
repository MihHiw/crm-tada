"use client";
import { CUSTOMERS_DATA } from '@/mocks/customer';
import { useEffect, useState } from 'react';

// 1. Cập nhật Interface hỗ trợ địa chỉ mới
export interface CustomerDetail {
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
    // Thêm interface address tại đây
    address: {
        region: string;
        province: string;
        city: string;
        detail: string;
    };
    metrics: {
        totalLoan?: string;
        currentDebt?: string;
        creditScore: string;
    };
    products: any[];
}

export function useCustomerByID(id: string) {
    const [data, setData] = useState<{
        customer: CustomerDetail | null;
        currentId: string | null;
    }>({
        customer: null,
        currentId: null,
    });

    // Loading dựa trên việc so sánh ID hiện tại và ID đang yêu cầu
    const loading = id !== data.currentId;

    useEffect(() => {
        if (!id) return;

        const timer = setTimeout(() => {
            const foundRaw = CUSTOMERS_DATA.find(c => c.id === id);

            if (foundRaw) {
                // Ép kiểu an toàn sang CustomerDetail
                const enrichedCustomer = {
                    ...foundRaw,
                    metrics: {
                        ...foundRaw.metrics,
                        totalLoan: foundRaw.metrics.totalLoan || "0 đ",
                        currentDebt: foundRaw.metrics.currentDebt || "0 đ",
                    }
                } as CustomerDetail;

                setData({
                    customer: enrichedCustomer,
                    currentId: id,
                });
            } else {
                setData({ customer: null, currentId: id });
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [id]);

    return {
        customer: loading ? null : data.customer,
        loading
    };
}