import { mockUsers, mockWalletTransactions } from '@/mocks/index';
import { WalletTransaction } from '@/types/types';
import { useEffect, useState } from 'react';

// Định nghĩa kiểu dữ liệu mở rộng cho giao diện
export interface TransactionWithUser extends WalletTransaction {
    user_name: string;
    user_avatar?: string;
}

export const useTransactions = () => {
    const [transactions, setTransactions] = useState<TransactionWithUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                // Giả lập delay mạng
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // --- LOGIC KẾT HỢP DỮ LIỆU (JOIN) ---
                const enrichedTransactions = mockWalletTransactions.map((tx) => {
                    const user = mockUsers.find((u) => u.id === tx.user_id);

                    return {
                        ...tx,
                        // Thêm trường mới cho UI
                        user_name: user ? user.full_name : 'Người dùng ẩn',

                        // --- SỬA TẠI ĐÂY ---
                        // Dùng toán tử || undefined để ép kiểu null về undefined
                        // Nếu user?.avatar_url là null, nó sẽ lấy giá trị undefined
                        user_avatar: user?.avatar_url || undefined,
                    };
                });

                setTransactions(enrichedTransactions);
            } catch (err) {
                console.error(err);
                setError('Không thể tải dữ liệu giao dịch.');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    return { transactions, loading, error };
};