// src/hooks/useBookingPageLogic/useBookingPageLogic.ts
import { useBookingAuth } from '@/hooks/booking/useBookingAuth';
import { useServicesData } from '@/hooks/servicespa/useServicesData'; 
import { useBookingForm } from '@/hooks/booking/useBookingForm';
import { useBookingMutation } from '@/hooks/booking/useBookingMutation';
import { useBookingTime } from '@/hooks/booking/useBookingTime';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';

// --- 1. TYPE DEFINITIONS ---
export interface BookingBox {
  id: string | number;
  name: string;
  sessions: number;
  price: number;
}

export interface BookingService {
  id: string | number;
  _id: string | number;
  name: string;
  price: number;
  duration_min: number; // Yêu cầu snake_case
  applicableBoxes: BookingBox[];
}

export function useBookingPageLogic() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { user } = useBookingAuth();
  const { serviceId: preSelectedServiceId } = router.query;
  
  const form = useBookingForm();
  const { confirmBooking, creating } = useBookingMutation();
  const { generateTimeSlots } = useBookingTime();

  const { services: rawServices, isLoading } = useServicesData();

  // --- 2. SỬA LỖI MAPPING: CamelCase -> Snake_case ---
  const services: BookingService[] = useMemo(() => {
    return rawServices.map(s => ({
      // Copy các trường chung (name, price...)
      id: s.id,
      name: s.name,
      price: s.price,
      
      // Map các trường khác biệt
      _id: s.id,                 // Map id -> _id
      duration_min: s.durationMin, // Map durationMin -> duration_min (FIX LỖI TẠI ĐÂY)
      
      // Map applicableBoxes
      applicableBoxes: s.applicableBoxes?.map(box => ({
        id: box.id,
        name: box.name,
        sessions: box.sessions,
        price: box.price
      })) || [] 
    }));
  }, [rawServices]);

  // --- 3. LOGIC PRE-SELECT ---
  useEffect(() => {
    if (preSelectedServiceId && services.length > 0 && !form.selectedService) {
      const found = services.find((s) => 
        s.id.toString() === preSelectedServiceId.toString() || 
        s._id.toString() === preSelectedServiceId.toString()
      );
      
      if (found) {
        form.selectService(found);
      }
    }
  }, [preSelectedServiceId, services, form]);

  const handleConfirmBooking = () => {
    const { selectedService, selectedDate, selectedTime, promotionCode } = form;

    if (!selectedService || !selectedDate || !selectedTime) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    confirmBooking({
      serviceId: selectedService._id.toString(),
      sessions: 1,
      date: selectedDate,
      time: selectedTime,
      promotionCode: promotionCode || undefined
    });
  };

  const hasEnoughBalance = (user?.balance || 0) >= form.totalAmount;

  return {
    services, 
    loadingServices: isLoading,
    user,
    logout,
    applicableBoxes: form.applicableBoxes,
    step: Number(form.step) || 1,
    selectedService: form.selectedService as BookingService | null,
    selectedBox: form.selectedBox,
    selectedDate: form.selectedDate,
    selectedTime: form.selectedTime,
    promotionCode: form.promotionCode,
    totalAmount: form.totalAmount,
    hasEnoughBalance,
    
    setSelectedDate: form.setSelectedDate,
    setSelectedTime: form.setSelectedTime,
    setPromotionCode: form.setPromotionCode,
    setStep: form.setStep,
    selectService: form.selectService,
    confirmDateTime: form.confirmDateTime,
    backStep: form.backStep,
    confirmBooking: handleConfirmBooking,
    generateTimeSlots,
    creating,
  };
}