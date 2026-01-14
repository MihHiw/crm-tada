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
  const { user, logout } = useAuthStore();
  const { services: rawServices, isLoading } = useServicesData();

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

  const calculations = useBookingCalculations(
    selectedService,
    selectedSessions,
    user?.balance || 0
  );

  const [creating, setCreating] = useState(false);

  const confirmDateTime = useCallback(() => {
    setStep(3);
  }, [setStep]);

  const confirmBooking = useCallback(async (payload: BookingPayload) => {
    setCreating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Booking Payload:", payload);
    alert("Đặt lịch thành công!");
    setCreating(false);
  }, []);

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
    user,
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
      hasEnoughBalance: (user?.balance || 0) >= calculations.totalAmount,

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