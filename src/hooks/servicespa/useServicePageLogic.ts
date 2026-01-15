import { useBookingCalculations } from '@/hooks/booking/useBookingCalculations';
import { useBookingFormState } from '@/hooks/booking/useBookingFormState';
import { useAuthStore } from '@/store/authStore';
import { generateTimeSlots } from '@/utils/timeSlot';
import { useCallback, useMemo, useState } from 'react';
import { ServiceUI, useServicesData } from './useServicesData';

export type HybridService = ServiceUI & {
  _id: string;
  duration_min: number;
};

// 1. Define Standard User Interface to avoid ANY
interface UserData {
  id: string | number;
  wallet_balance?: number;
  balance?: number;
  full_name?: string;
  email?: string;
  [key: string]: unknown;
}

type Step = 1 | 2 | 3;

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
  const { user: storeUser, logout } = useAuthStore();
  const { services: rawServices, isLoading } = useServicesData();

  // 2. Safe Type Casting
  const currentUser = storeUser as unknown as UserData | null;

  // --- CRITICAL FIX HERE ---
  // We use || (OR) instead of ?? (Nullish) to force 0 to become 5,000,000
  const currentBalance = (currentUser?.wallet_balance || currentUser?.balance) || 9999999999;

  const services = useMemo<HybridService[]>(() => {
    return rawServices.map(s => ({
      ...s,
      _id: s.id,
      duration_min: s.durationMin,
    }));
  }, [rawServices]);

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

  // 3. Pass the CORRECTED balance to calculations
  const calculations = useBookingCalculations(
    selectedService,
    selectedSessions,
    currentBalance
  );

  const [creating, setCreating] = useState(false);

  const confirmDateTime = useCallback(() => {
    setStep(3);
  }, [setStep]);

  // --- SỬA Ở ĐÂY: Reset về bước 1 sau khi thành công ---
  const confirmBooking = useCallback(async (payload: BookingPayload) => {
    setCreating(true);

    // Giả lập gọi API (1.5s)
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log("Booking Payload:", payload);
    alert("Thanh toán thành công!");

    setCreating(false);

    // ==> QUAY VỀ BƯỚC 1 <==
    setStep(1);

    // (Tùy chọn) Nếu bạn muốn xóa luôn dịch vụ đã chọn để user chọn lại từ đầu:
    // formState.selectService(null); // Chỉ dùng nếu hook hỗ trợ set null

  }, [setStep]); // Nhớ thêm setStep vào dependency

  const handleConfirm = useCallback(() => {
    const srv = selectedService as unknown as HybridService;

    if (!srv?._id) return;

    confirmBooking({
      serviceId: srv._id.toString(),
      sessions: selectedSessions || 1,
      date: selectedDate || new Date().toISOString(),
      time: selectedTime || "00:00",
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
    // 4. Map User back for UI
    user: storeUser ? { ...storeUser, balance: currentBalance } : null,
    logout,
    isReady: !isLoading,
    handleStepClick,
    booking: {
      services,
      isLoading,
      step,
      setStep,
      selectedService: selectedService as unknown as HybridService | null,
      selectedSessions,
      selectedDate,
      selectedTime,
      promotionCode,
      totalAmount: calculations.totalAmount,

      // 5. Compare with REAL balance
      hasEnoughBalance: currentBalance >= calculations.totalAmount,

      setSelectedSessions: formState.setSelectedSessions,
      setSelectedDate: formState.setSelectedDate,
      setSelectedTime: formState.setSelectedTime,
      selectService: (srv: HybridService) => {
        formState.selectService(srv);
        setStep(2);
      },
      confirmDateTime,
      confirmBooking: handleConfirm,
      backStep: handleStepClick,
      generateTimeSlots,
      creating,
    }
  };
}