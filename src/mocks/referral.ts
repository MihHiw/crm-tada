import { Referral } from '@/types/types';


export const mockReferrals: Referral[] = [
    {
        id: 'ref-01',
        referrer_id: 'cust-02',
        referred_user_id: 'cust-01',
        commission_amount: 100000,
        status: 'COMPLETED',
        created_at: '2025-02-01T09:00:00Z',
    },
    {
        id: 'ref-02',
        referrer_id: 'cust-02',
        referred_user_id: 'cust-01',
        commission_amount: 100000,
        status: 'PENDING',
        created_at: '2025-02-01T09:00:00Z',
    },
    {
        id: 'ref-03',
        referrer_id: 'cust-02',
        referred_user_id: 'cust-01',
        commission_amount: 100000,
        status: 'PENDING',
        created_at: '2025-02-01T09:00:00Z',
    },
    {
        id: 'ref-04',
        referrer_id: 'cust-02',
        referred_user_id: 'staff-01',
        commission_amount: 100000,
        status: 'COMPLETED',
        created_at: '2025-02-01T09:00:00Z',
    },
    {
        id: 'ref-05',
        referrer_id: 'staff-01',
        referred_user_id: 'user-admin-01',
        commission_amount: 100000,
        status: 'COMPLETED',
        created_at: '2025-02-01T09:00:00Z',
    },


    {
        id: 'ref-06',
        referrer_id: 'staff-02',
        referred_user_id: 'user-admin-01',
        commission_amount: 100000,
        status: 'COMPLETED',
        created_at: '2025-02-01T09:00:00Z',
    },

    {
        id: 'ref-07',
        referrer_id: 'manager-01',
        referred_user_id: 'user-admin-01',
        commission_amount: 100000,
        status: 'COMPLETED',
        created_at: '2025-02-01T09:00:00Z',
    },
];
