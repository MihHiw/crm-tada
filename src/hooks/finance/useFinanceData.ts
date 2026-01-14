import { mockPromotions, mockReferrals, mockUsers, mockWalletTransactions } from '@/mocks'; // Import mock data
import { Promotion, Referral, WalletTransaction } from '@/types/types';
import { useEffect, useState } from 'react';

// --- EXTENDED TYPES (Cho UI) ---

export interface TransactionExtended extends WalletTransaction {
    user_name: string;
    user_avatar?: string | null;
    user_phone: string;
}

export interface ReferralExtended extends Referral {
    referrer_name: string; // Người giới thiệu
    referred_user_name: string; // Người được giới thiệu
}

// --- HOOK ---

export const useFinanceData = () => {
    const [transactions, setTransactions] = useState<TransactionExtended[]>([]);
    const [referrals, setReferrals] = useState<ReferralExtended[]>([]);
    const [promotions, setPromotions] = useState<Promotion[]>([]); // Promotion không cần join user
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            // Giả lập delay API
            await new Promise(resolve => setTimeout(resolve, 600));

            // 1. Join Transaction với User
            const mappedTransactions = mockWalletTransactions.map(tx => {
                const user = mockUsers.find(u => u.id === tx.user_id);
                return {
                    ...tx,
                    user_name: user?.full_name ?? 'Unknown User',
                    user_avatar: user?.avatar_url ?? null,
                    user_phone: user?.phone ?? '',
                };
            });

            // 2. Join Referral với User (2 chiều)
            const mappedReferrals = mockReferrals.map(ref => {
                const referrer = mockUsers.find(u => u.id === ref.referrer_id);
                const referred = mockUsers.find(u => u.id === ref.referred_user_id);
                return {
                    ...ref,
                    referrer_name: referrer?.full_name ?? 'Unknown',
                    referred_user_name: referred?.full_name ?? 'Unknown',
                };
            });

            setTransactions(mappedTransactions);
            setReferrals(mappedReferrals);
            setPromotions(mockPromotions);
            setLoading(false);
        };

        fetchData();
    }, []);

    return { transactions, referrals, promotions, loading };
};