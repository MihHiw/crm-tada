import { Membership } from '@/types/types';


export const mockMemberships: Membership[] = [
    {
        id: 'mem-01',
        user_id: 'cust-01',
        rank_id: 1,
        card_number: 'VN-000123',
        current_points: 150,
        total_spent: 1500000,
        start_date: '2025-02-01T00:00:00Z',
        is_active: true,
    },
    {
        id: 'mem-02',
        user_id: 'cust-02',
        rank_id: 3, // Gold
        card_number: 'VN-888888',
        current_points: 5000,
        total_spent: 20000000,
        start_date: '2025-02-05T00:00:00Z',
        is_active: true,
    },
];