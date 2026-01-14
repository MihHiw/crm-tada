import { mockBookings, mockServices, mockWalletTransactions } from '@/mocks';
import { Booking, WalletTransaction } from '@/types/types';
import { useEffect, useState } from 'react';

// 1. Interface đầu ra (cho UI dùng)
export interface BookingExtended extends Booking {
    service_name: string;
    duration_minutes: number;
    location?: string;
    total_amount?: number;
    amount?: number;
}

// 2. Interface phụ trợ: Mô tả các trường có thể có trong Mock Data
// nhưng chưa được định nghĩa trong Booking gốc.
// Thay vì dùng any, ta khai báo rõ những gì ta định lấy.
interface MockBookingExtras {
    total_amount?: number;
    amount?: number;
    location?: string;
}

export const useHistoryData = (statusFilter: string) => {
    const [bookings, setBookings] = useState<BookingExtended[]>([]);
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 600));

            let mappedBookings: BookingExtended[] = mockBookings.map((b) => {
                const service = mockServices?.find((s) => s.id === b.service_id);

                // --- SỬA LỖI TẠI ĐÂY ---
                // Thay vì ép kiểu sang Record<string, any>, 
                // ta ép sang kiểu MockBookingExtras đã định nghĩa ở trên.
                const raw = b as unknown as MockBookingExtras;

                // Bây giờ TypeScript hiểu raw có thể có total_amount, amount...
                // mà không cần dùng any.
                const price = raw.total_amount || raw.amount || service?.price || 0;
                const location = raw.location || 'Chi nhánh trung tâm';

                return {
                    ...b,
                    service_name: service?.name || 'Dịch vụ Spa',
                    duration_minutes: service?.duration_minutes || 60,
                    location: location,
                    total_amount: price,
                    amount: price,
                };
            });

            if (statusFilter !== 'all') {
                mappedBookings = mappedBookings.filter((b) => b.status === statusFilter);
            }

            mappedBookings.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

            const sortedTransactions = [...mockWalletTransactions].sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );

            setBookings(mappedBookings);
            setTransactions(sortedTransactions);
            setLoading(false);
        };

        fetchData();
    }, [statusFilter]);

    return { bookings, transactions, loading };
};