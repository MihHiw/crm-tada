import { mockBookings, mockServices, mockUsers } from '@/mocks';
import { Booking } from '@/types/types';
import { useQuery } from 'react-query';

// --- 1. TYPE DEFINITIONS ---

// Type mở rộng cho UI: Booking gốc + Tên khách + Tên dịch vụ
export interface BookingExtended extends Booking {
    customer_name: string;
    customer_phone: string;
    customer_avatar?: string | null;
    service_name: string;
    staff_name: string;
}


const fetchBookingsData = async (): Promise<BookingExtended[]> => {
    // Giả lập network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Thực hiện "Join" dữ liệu từ các mock data khác nhau
    return mockBookings.map((booking) => {
        // 1. Tìm thông tin khách hàng
        const customer = mockUsers.find((u) => u.id === booking.user_id);

        // 2. Tìm thông tin dịch vụ
        const service = mockServices.find((s) => s.id === booking.service_id);

        // 3. Tìm thông tin nhân viên (nếu có)
        const staff = mockUsers.find((u) => u.id === booking.staff_id);

        return {
            ...booking,
            customer_name: customer?.full_name ?? 'Khách vãng lai',
            customer_phone: customer?.phone ?? '',
            customer_avatar: customer?.avatar_url ?? null,
            service_name: service?.name ?? 'Dịch vụ đã xóa',
            staff_name: staff?.full_name ?? 'Chưa phân công',
        };
    });
};

// --- 3. HOOK CHÍNH ---

export function useBookings() {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQuery<BookingExtended[]>(
        ['bookings', 'all'], // Query Key
        fetchBookingsData,   // Query Fn
        {
            staleTime: 60 * 1000, // Dữ liệu được coi là mới trong 1 phút
            keepPreviousData: true, // Giữ dữ liệu cũ khi đang fetch mới (tránh nhấp nháy)
            retry: 1,
        }
    );

    return {
        bookings: data ?? [], // Luôn trả về mảng rỗng nếu undefined (safeguard)
        loadingBookings: isLoading,
        isError,
        refetchBookings: refetch,
    };
}