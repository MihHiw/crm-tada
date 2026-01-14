import { Booking } from '@/types/types';

export const mockBookings: Booking[] = [
    {
        id: 'bk-001',
        user_id: 'cust-01',
        staff_id: 'staff-01',
        service_id: 'srv-01',
        start_time: '2026-01-08T09:00:00',
        end_time: '2026-01-08T10:00:00',
        status: 'confirmed',
        total_price: 350000,
        notes: 'Khách dị ứng với hương liệu mạnh',
        created_at: '2026-01-07T10:00:00Z',
        booking_id: 'bk-001',
        updated_by: 'cust-01',
        final_amount: 450000,
    },
    {
        id: 'bk-002',
        user_id: 'cust-02',
        staff_id: 'staff-01',
        service_id: 'srv-03',
        start_time: '2026-01-08T14:00:00',
        end_time: '2026-01-08T15:30:00',
        status: 'pending',
        total_price: 450000,
        created_at: '2026-01-07T11:30:00Z',
        booking_id: 'bk-001',
        updated_by: 'user-admin-01',
        final_amount: 450000,
        note: 'Đã xác nhận qua điện thoại',
    },
];


