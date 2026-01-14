import { WalletTransaction } from '@/types/types';

export const mockWalletTransactions: WalletTransaction[] = [
    {
        id: 'tx-01',
        user_id: 'cust-02',
        amount: 5000000,
        type: 'deposit',
        description: 'Nạp tiền thẻ thành viên',
        status: 'success',
        created_at: '2025-12-25T10:00:00Z',
    },
    {
        id: 'tx-02',
        user_id: 'cust-02',
        amount: -450000,
        type: 'payment',
        reference_id: 'bk-002',
        description: 'Thanh toán dịch vụ Massage',
        status: 'success',
        created_at: '2026-01-08T15:30:00Z',
    },
];