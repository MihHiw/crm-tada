// hooks/booking/useBookingMutation.ts
import { bookingAPI } from '@/lib/api';
import { AxiosError } from 'axios'; // 1. Import AxiosError
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';

// 2. Định nghĩa cấu trúc backend trả về khi có lỗi (tùy chọn nhưng nên có)
interface ApiError {
    message?: string;
}

export function useBookingMutation() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const createBookingMutation = useMutation(bookingAPI.create, {
        onSuccess: () => {
            queryClient.invalidateQueries('bookings');
            queryClient.invalidateQueries('user');
            router.push('/app/history?tab=bookings');
        },
        // 3. SỬA LỖI: Thay 'any' bằng AxiosError kết hợp với interface ApiError
        onError: (err: AxiosError<ApiError>) => {
            const errorMessage = err.response?.data?.message || 'Đặt dịch vụ thất bại';
            alert(errorMessage);
        },
    });

    const confirmBooking = (payload: {
        serviceId: string;
        sessions: number;
        date: string;
        time: string;
        promotionCode?: string;
    }) => {
        const { serviceId, sessions, date, time, promotionCode } = payload;

        if (!serviceId || !sessions || !date || !time) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        createBookingMutation.mutate({
            serviceId,
            sessions,
            startTime: new Date(`${date}T${time}`).toISOString(),
            promotionCode: promotionCode || undefined,
        });
    };

    return {
        confirmBooking,
        creating: createBookingMutation.isLoading
    };
}