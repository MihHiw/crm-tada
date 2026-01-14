import { mockPromotions } from '@/mocks';
import { Promotion as DBPromotion } from '@/types/types';
import { useEffect, useMemo, useState } from 'react';

// --- 1. INTERFACE CHO UI ---
export interface PromotionUI {
    id: string;
    title: string;
    name: string;
    description: string;
    code: string;
    discountAmount: string;
    expiryDate: string;
    startDate: string;
    bannerUrl: string;
    targetType: 'all' | 'customer';
    allowedUserIds: string[];
    isActive: boolean;
}

// --- 2. CORE FETCH HOOK ---
const useFetchUserPromotions = (userId: string = 'cust-01') => {
    const [data, setData] = useState<PromotionUI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                await new Promise((resolve) => setTimeout(resolve, 600));

                const now = new Date();

                // TRANSFORM: DB -> UI
                const mappedData: PromotionUI[] = mockPromotions.map((item) => {
                    // --- SỬA LỖI TẠI ĐÂY ---
                    // Thay vì dùng @ts-ignore, ta mở rộng type DBPromotion thêm trường description (optional)
                    // TypeScript sẽ hiểu p có thể có description mà không báo lỗi.
                    const p = item as unknown as (DBPromotion & { description?: string });

                    const endDate = new Date(p.end_date);
                    const startDate = new Date(p.start_date);
                    const isActive = now >= startDate && now <= endDate;

                    const discountDisplay = p.discount_type === 'percent'
                        ? `${p.discount_value}%`
                        : `${new Intl.NumberFormat('vi-VN').format(p.discount_value)}đ`;

                    const isPrivate = p.code.startsWith('VIP') || p.code.startsWith('BDAY');

                    // Bây giờ truy cập p.description là hợp lệ, không cần ignore nữa
                    const descText = p.description || `Giảm ${discountDisplay} cho mọi đơn hàng.`;

                    return {
                        id: p.id,
                        title: p.name,
                        name: p.name,
                        description: descText,
                        code: p.code,
                        discountAmount: discountDisplay,
                        expiryDate: p.end_date,
                        startDate: p.start_date,
                        bannerUrl: `https://placehold.co/600x250/orange/white?text=${p.code}`,
                        targetType: isPrivate ? 'customer' : 'all',
                        allowedUserIds: isPrivate ? [userId] : [],
                        isActive: isActive,
                    };
                });

                const relevantPromotions = mappedData.filter(p =>
                    p.isActive &&
                    (p.targetType === 'all' || p.allowedUserIds.includes(userId))
                );

                setData(relevantPromotions);
            } catch (err) {
                console.error("Lỗi tải khuyến mãi:", err);
                setError(err instanceof Error ? err : new Error(String(err)));
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [userId]);

    return { data, loading, error };
};

// --- 3. MAIN HOOK ---
export const usePromotions = (currentUserId?: string) => {
    const effectiveUserId = currentUserId || 'cust-01';
    const { data: allPromotions, loading, error } = useFetchUserPromotions(effectiveUserId);

    const categorizedPromotions = useMemo(() => {
        const publicPromos = allPromotions.filter(p => p.targetType === 'all');
        const privatePromos = allPromotions.filter(p => p.targetType === 'customer');

        return {
            publicPromos,
            privatePromos,
            allPromos: allPromotions
        };
    }, [allPromotions]);

    return {
        loading,
        error,
        publicPromotions: categorizedPromotions.publicPromos,
        privatePromotions: categorizedPromotions.privatePromos,
        hasPrivateOffers: categorizedPromotions.privatePromos.length > 0,
        allPromotions: categorizedPromotions.allPromos
    };
};