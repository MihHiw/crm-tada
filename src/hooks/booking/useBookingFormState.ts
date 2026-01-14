// hooks/booking/useBookingFormState.ts
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export type Step = 1 | 2 | 3;

// 1. Định nghĩa lại Interface để dùng chung (nên move vào folder types/ nếu dùng nhiều nơi)
interface BookingBox {
    id: string | number;
    name: string;
    sessions: number;
    price: number;
}

interface BookingService {
    _id: string | number; // Thêm _id vì logic tìm kiếm của bạn dùng s._id
    name: string;
    price: number;
    applicableBoxes?: BookingBox[];
}

export function useBookingFormState(services: BookingService[]) {
    const router = useRouter();
    const { serviceId: preSelectedServiceId } = router.query;

    const [step, setStep] = useState<Step>(1);

    // 2. Thay thế any bằng interface cụ thể hoặc null
    const [selectedService, setSelectedService] = useState<BookingService | null>(null);
    const [selectedBox, setSelectedBox] = useState<BookingBox | null>(null);

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [promotionCode, setPromotionCode] = useState('');
    const [selectedSessions, setSelectedSessions] = useState<number | null>(1);

    const sessionOptions = [1, 5, 10, 15];

    // Pre-select service logic
    useEffect(() => {
        if (!preSelectedServiceId || selectedService || !services.length) return;

        // 3. TypeScript giờ đã biết s là BookingService, không còn lỗi 'any'
        const found = services.find((s: BookingService) => s._id === preSelectedServiceId);
        if (found) {
            setSelectedService(found);
            setStep(2);
        }
    }, [preSelectedServiceId, services, selectedService]);

    // 4. Định nghĩa kiểu cho tham số truyền vào
    const selectService = (service: BookingService) => {
        setSelectedService(service);
        setSelectedBox(null);
        setStep(2);
    };

    const backStep = (target: Step) => {
        if (target <= 1) {
            setSelectedBox(null);
            setSelectedDate('');
            setSelectedTime('');
        }
        if (target === 2) {
            setSelectedDate('');
            setSelectedTime('');
        }
        setStep(target);
    };

    return {
        step, setStep,
        selectedService, setSelectedService,
        selectedBox, setSelectedBox, selectBox: setSelectedBox,
        selectedDate, setSelectedDate,
        selectedTime, setSelectedTime,
        promotionCode, setPromotionCode,
        selectedSessions, setSelectedSessions,
        sessionOptions,
        selectService,
        backStep
    };
}