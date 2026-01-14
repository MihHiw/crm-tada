import { useState } from 'react';

// 1. Định nghĩa interface cho Box (Gói dịch vụ)
interface BookingBox {
    id: string | number;
    name: string;
    sessions: number;
    price: number;
}

// 2. Định nghĩa interface cho Service (Dịch vụ)
export interface BookingService {
    id: string | number;         // Cần thiết cho useBookingForm
    _id: string | number;        // Cần thiết cho logic tìm kiếm trong useBookingPageLogic
    name: string;
    price: number;
    duration_min: number;        // Cần thiết cho hiển thị trong booking.tsx
    applicableBoxes: BookingBox[]; // Phải là mảng bắt buộc (không để optional ?)
}

export function useBookingForm() {
    const [step, setStep] = useState(1);

    // 3. Thay thế any bằng interface đã định nghĩa
    const [selectedService, setSelectedService] = useState<BookingService | null>(null);
    const [selectedBox, setSelectedBox] = useState<BookingBox | null>(null);

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [promotionCode, setPromotionCode] = useState('');

    // 4. Sửa tham số truyền vào hàm selectService
    const selectService = (service: BookingService) => {
        setSelectedService(service);
        setSelectedBox(null);
        setStep(2);
    };

    const confirmDateTime = () => {
        if (!selectedDate || !selectedTime) {
            alert('Vui lòng chọn ngày và giờ');
            return false;
        }
        setStep(3);
        return true;
    };

    const backStep = (targetStep: number) => {
        if (targetStep < 4) setPromotionCode('');
        if (targetStep < 3) {
            setSelectedDate('');
            setSelectedTime('');
        }
        if (targetStep < 2) setSelectedBox(null);
        if (targetStep < 1) setSelectedService(null);
        setStep(targetStep);
    };

    // Derived state - Bây giờ đã có kiểu dữ liệu an toàn
    const applicableBoxes = selectedService?.applicableBoxes || [];
    const totalAmount = selectedService?.price || 0;

    return {
        step, setStep,
        selectedService, setSelectedService,
        selectedBox, setSelectedBox,
        selectedDate, setSelectedDate,
        selectedTime, setSelectedTime,
        promotionCode, setPromotionCode,
        applicableBoxes,
        totalAmount,
        selectService,
        confirmDateTime,
        backStep
    };
}