import { useMemo } from 'react';

// 1. Định nghĩa interface cho Service thay vì dùng any
export interface BookingService {
    name: string;
    price: number;
}

// 2. Định nghĩa kiểu cho mục trong summary
export interface SummaryItem {
    label: string;
    value: string;
}

export interface UseBookingSummaryProps {
    // Thay any bằng BookingService
    selectedService: BookingService | null;
    selectedSessions: number | null;
}

export function useBookingSummary({
    selectedService,
    selectedSessions,
}: UseBookingSummaryProps) {
    const discountPercent = useMemo(() => {
        if (!selectedSessions) return 0;
        if (selectedSessions === 10) return 10;
        if (selectedSessions === 15) return 15;
        return 0;
    }, [selectedSessions]);

    // Tính tổng tiền
    const totalAmount = useMemo(() => {
        if (!selectedService || !selectedSessions) return 0;
        return selectedService.price * selectedSessions * (1 - discountPercent / 100);
    }, [selectedService, selectedSessions, discountPercent]);

    // Tạo summary hiển thị
    const summary = useMemo((): SummaryItem[] => {
        if (!selectedService || !selectedSessions) return [];

        const items = [
            { label: 'Liệu trình', value: selectedService.name },
            { label: 'Số buổi', value: `${selectedSessions} buổi` },
            {
                label: 'Giá gốc',
                value: `${(selectedService.price * selectedSessions).toLocaleString()}đ`,
            },
            discountPercent > 0 ? { label: 'Ưu đãi', value: `- ${discountPercent}%` } : null,
            { label: 'Tổng cộng', value: `${totalAmount.toLocaleString()}đ` },
        ];

        // Ép kiểu Type Guard để loại bỏ các giá trị null/false một cách an toàn
        return items.filter((item): item is SummaryItem => item !== null);
    }, [selectedService, selectedSessions, discountPercent, totalAmount]);

    return { summary, totalAmount, discountPercent };
}