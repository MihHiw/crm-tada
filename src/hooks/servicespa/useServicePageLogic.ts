import { useBookingCalculations } from '@/hooks/booking/useBookingCalculations';
import { useBookingFormState } from '@/hooks/booking/useBookingFormState';
import { useAuthStore } from '@/store/authStore';
import { generateTimeSlots } from '@/utils/timeSlot';
import { useCallback, useMemo, useState } from 'react';
import { ServiceUI, useServicesData } from './useServicesData';

// 1. Export Type để dùng ở booking.tsx
export type HybridService = ServiceUI & {
  _id: string;        // Tương thích code cũ
  duration_min: number; // Tương thích code cũ
};

// Định nghĩa Type Step rõ ràng
type Step = 1 | 2 | 3;

// Type Guard để kiểm tra xem một số có phải là Step hợp lệ không
function isStep(target: number): target is Step {
  return [1, 2, 3].includes(target);
}

interface BookingPayload {
  serviceId: string;
  sessions: number;
  date: string;
  time: string;
  promotionCode?: string;
}

export function useServicePageLogic() {
  const { user, logout } = useAuthStore();
  const { services: rawServices, isLoading } = useServicesData();

  // 2. Adapter: Chuyển đổi dữ liệu sang dạng Hybrid
  const services = useMemo<HybridService[]>(() => {
    return rawServices.map(s => ({
      ...s,
      _id: s.id, // Map id -> _id
      duration_min: s.durationMin, // Map durationMin -> duration_min
    }));
  }, [rawServices]);

  // 3. Gọi hook form state
  // FIX: Xóa 'as any'. Nếu hook yêu cầu kiểu cụ thể, TypeScript sẽ tự suy luận 
  // hoặc ta dùng Generic nếu hook hỗ trợ: useBookingFormState<HybridService>(services)
  // Nếu vẫn lỗi type strict, dùng: services as unknown as any[] (nhưng tốt nhất là để nguyên)
  const formState = useBookingFormState(services);

  const {
    selectedService,
    selectedSessions,
    selectedDate,
    selectedTime,
    promotionCode,
    step,
    backStep,
    setStep
  } = formState;

  const calculations = useBookingCalculations(
    selectedService,
    selectedSessions,
    user?.balance || 0
  );

  const [creating, setCreating] = useState(false);

  // 4. Implement confirmDateTime
  const confirmDateTime = useCallback(() => {
    if (selectedDate && selectedTime) {
      setStep(3);
    }
  }, [selectedDate, selectedTime, setStep]);

  const confirmBooking = useCallback(async (payload: BookingPayload) => {
    setCreating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Booking Payload:", payload);
    alert("Đặt lịch thành công!");
    setCreating(false);
  }, []);

  const handleConfirm = useCallback(() => {
    // FIX: Thay 'as any' bằng Type Assertion an toàn hơn (unknown -> Type)
    // TypeScript cho phép ép kiểu từ unknown sang kiểu cụ thể
    const srv = selectedService as unknown as HybridService;

    if (!srv?._id || !selectedDate || !selectedTime) {
      return;
    }

    confirmBooking({
      serviceId: srv._id.toString(),
      // Fix lỗi null: fallback về 1
      sessions: selectedSessions || 1,
      date: selectedDate,
      time: selectedTime,
      promotionCode
    });
  }, [selectedService, selectedSessions, selectedDate, selectedTime, promotionCode, confirmBooking]);

  const handleStepClick = useCallback((target: number) => {
    if (target > step) return;

    if (isStep(target)) {
      backStep(target);
    }
  }, [step, backStep]);

  return {
    user,
    logout,
    isReady: !isLoading,
    handleStepClick,
    booking: {
      services,
      isLoading,
      step,
      setStep, // Đã có để nhảy bước thủ công
      selectedService: selectedService as unknown as HybridService | null,
      selectedSessions, // Thêm sessions hiện tại
      selectedDate,
      selectedTime,
      promotionCode,
      totalAmount: calculations.totalAmount,
      hasEnoughBalance: (user?.balance || 0) >= calculations.totalAmount,

      // --- CÁC HÀM QUAN TRỌNG CHO UI ---
      setSelectedSessions: formState.setSelectedSessions, 
      setSelectedDate: formState.setSelectedDate,
      setSelectedTime: formState.setSelectedTime,
      selectService: (srv: HybridService) => {
        formState.selectService(srv);
        setStep(2); // Tự động nhảy sang bước 2 khi chọn dịch vụ
      },
      confirmDateTime,
      confirmBooking: handleConfirm,
      backStep: handleStepClick,
      generateTimeSlots,
      creating,
    }
  };
}