// hooks/booking/useBookingCalculations.ts
import { useMemo } from 'react';

// 1. Định nghĩa interface cho Service để thay thế 'any'
interface BookingService {
    name: string;
    price: number;
    // Bạn có thể thêm các trường khác nếu cần, ví dụ: id: string;
}

// 2. Định nghĩa kiểu dữ liệu cho mục trong summary
interface SummaryItem {
    label: string;
    value: string;
}

export function useBookingCalculations(
    selectedService: BookingService | null | undefined, // Thay any bằng interface cụ thể
    selectedSessions: number | null,
    userBalance: number = 0
) {
    const discountPercent = useMemo(() => {
        if (!selectedSessions) return 0;
        if (selectedSessions === 10) return 10;
        if (selectedSessions === 15) return 15;
        return 0;
    }, [selectedSessions]);

    const totalAmount = useMemo(() => {
        if (!selectedService || !selectedSessions) return 0;
        return selectedService.price * selectedSessions * (1 - discountPercent / 100);
    }, [selectedService, selectedSessions, discountPercent]);

    const summary = useMemo((): SummaryItem[] => {
        if (!selectedService || !selectedSessions) return [];

        // Sử dụng mảng và ép kiểu để loại bỏ giá trị false/null một cách an toàn
        const items = [
            { label: 'Liệu trình', value: selectedService.name },
            { label: 'Số buổi', value: `${selectedSessions} buổi` },
            { label: 'Giá gốc', value: `${(selectedService.price * selectedSessions).toLocaleString()}đ` },
            discountPercent > 0 ? { label: 'Ưu đãi', value: `- ${discountPercent}%` } : null,
            { label: 'Tổng cộng', value: `${totalAmount.toLocaleString()}đ` },
        ];

        return items.filter((item): item is SummaryItem => item !== null);
    }, [selectedService, selectedSessions, discountPercent, totalAmount]);

    const hasEnoughBalance = userBalance >= totalAmount;

    return { discountPercent, totalAmount, summary, hasEnoughBalance };
}