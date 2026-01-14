import { Promotion } from '@/types/types';


export const mockPromotions: Promotion[] = [
    {
        id: 'promo-01',
        code: 'WELCOME',
        name: 'Giảm giá chào mừng',
        discount_type: 'percent',
        discount_value: 20,
        max_discount_value: 100000,
        start_date: '2025-01-01',
        end_date: '2026-12-31',
        target_type: 'all'
    },
    {
        id: 'promo-02',
        code: 'TET2026',
        name: 'Lì xì Tết',
        discount_type: 'fixed',
        discount_value: 50000,
        min_order_value: 500000,
        start_date: '2026-01-15',
        end_date: '2026-01-30',
        target_type: 'all'
    },
    {
        id: 'promo-03',
        code: 'VIP_ONLY',
        name: 'Ưu đãi riêng cho bạn',
        discount_type: 'percent',
        discount_value: 50,
        start_date: '2025-01-01',
        end_date: '2026-12-31',
        target_type: 'specific',
        applicable_users: ['cust-02', 'user-01']
    },
];