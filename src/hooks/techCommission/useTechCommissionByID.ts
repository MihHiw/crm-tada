import { mockReferrals, mockUsers } from '@/mocks';
import { useEffect, useMemo, useState } from 'react';
import { CommissionRecord, CommissionStatus, StaffRole } from './useTechcommission';

// --- 1. TYPE DEFINITIONS ---
export interface UserProfile {
    id: string;
    name: string;
    phone: string;
    role: StaffRole;
    avatar: string;
    email?: string;
}

export interface CommissionStatsDetail {
    totalCommission: number;
    paidCommission: number;
    pendingCommission: number;
    jobCount: number;
}

const getRoleString = (roleId: number): StaffRole => {
    if (roleId === 2) return 'ktv';
    if (roleId === 3) return 'sale';
    return 'ctv';
};

// --- 2. HOOK ---
export const useTechCommissionByID = (userId: string | null) => {
    const [transactions, setTransactions] = useState<CommissionRecord[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadData = async () => {
            if (!userId) {
                setTransactions([]);
                setProfile(null);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 500));

                // A. TÌM PROFILE USER
                const userRaw = mockUsers.find(u => u.id === userId);
                if (userRaw) {
                    const role = getRoleString(userRaw.role_id);
                    setProfile({
                        id: userRaw.id,
                        name: userRaw.full_name,
                        phone: userRaw.phone || '',
                        avatar: userRaw.avatar_url || '',
                        email: userRaw.email || '',
                        role: role
                    });
                } else {
                    setProfile(null);
                }

                // B. TÌM & MAP GIAO DỊCH
                const userReferrals = mockReferrals.filter(ref => ref.referrer_id === userId);

                const mappedTransactions: CommissionRecord[] = userReferrals.map(ref => {
                    // --- SỬA LỖI TẠI ĐÂY ---
                    // Ép kiểu an toàn: Coi ref như thể nó có thêm thuộc tính note (optional)
                    // Cách này không dùng 'any' nên ESLint sẽ không báo lỗi
                    const refWithNote = ref as typeof ref & { note?: string };

                    return {
                        id: ref.id,
                        transactionCode: ref.id.toUpperCase(),
                        fullName: userRaw?.full_name || 'Unknown',
                        phone: userRaw?.phone || '',
                        avatar: userRaw?.avatar_url || null,
                        role: getRoleString(userRaw?.role_id || 4),

                        // Truy cập note an toàn
                        serviceName: refWithNote.note || 'Hoa hồng dịch vụ',

                        commission: ref.commission_amount,
                        joinedDate: ref.created_at,
                        // Ép kiểu status an toàn
                        status: (ref.status as CommissionStatus) || 'pending',
                    };
                });

                setTransactions(mappedTransactions);

            } catch (error) {
                console.error("Lỗi tải chi tiết hoa hồng:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [userId]);

    // 3. TÍNH TOÁN THỐNG KÊ
    const stats = useMemo<CommissionStatsDetail>(() => {
        return transactions.reduce(
            (acc, curr) => {
                const isCompleted = curr.status === 'completed';
                const amount = curr.commission;

                return {
                    totalCommission: acc.totalCommission + amount,
                    paidCommission: isCompleted ? acc.paidCommission + amount : acc.paidCommission,
                    pendingCommission: !isCompleted ? acc.pendingCommission + amount : acc.pendingCommission,
                    jobCount: acc.jobCount + 1,
                };
            },
            {
                totalCommission: 0,
                paidCommission: 0,
                pendingCommission: 0,
                jobCount: 0,
            }
        );
    }, [transactions]);

    return {
        profile,
        transactions,
        stats,
        loading
    };
};