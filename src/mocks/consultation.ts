import { Consultation } from '@/types/types';

export const mockConsultations: Consultation[] = [
    {
        id: 'cons-01',
        customer_id: 'cust-01',
        name: 'Phạm Khách Hàng',
        phone: '0123456789',
        email: 'khach1@gmail.com',
        service: 'Trị mụn cơ bản',
        notes: 'Da hỗn hợp thiên dầu.',
        status: 'PENDING',
        source: 'Facebook Ads',
        created_at: '2026-01-08T09:10:00Z',
        note: 'Hệ thống tiếp nhận yêu cầu từ Facebook Ads',
        createdBy: 'Hệ thống'

    },
    {
        id: 'cons-02',
        customer_id: 'cust-02',
        name: 'Hoàng Thị VIP',
        phone: '0987654321',
        email: 'vip@gmail.com',
        service: 'Cấy tảo xoắn Nano',
        notes: 'Cần tư vấn kỹ về serum.',
        status: 'CONTACTED',
        source: 'Website',
        created_at: '2026-01-08T10:30:00Z',
        note: 'Khách để lại thông tin qua Website.',
        createdBy: 'Hệ thống'
    }
];