"use client";
import { CUSTOMERS_DATA } from '@/mocks/customer';
import { useEffect, useState } from 'react';

export function useCustomerByID(id: string) {
    // Chỉ cần 1 state duy nhất
    const [data, setData] = useState<{
        customer: any | null;
        currentId: string | null;
    }>({
        customer: null,
        currentId: null,
    });

    // Xác định loading dựa trên việc ID trong state có khớp với ID truyền vào hay không
    const loading = id !== data.currentId;

    useEffect(() => {
        if (!id) return;

        const timer = setTimeout(() => {
            const found = CUSTOMERS_DATA.find(c => c.id === id);
            setData({
                customer: found || null,
                currentId: id, // Đánh dấu đã tải xong ID này
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [id]);

    return {
        customer: loading ? null : data.customer,
        loading
    };
}