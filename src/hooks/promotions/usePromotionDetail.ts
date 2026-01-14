import { mockPromotions } from '@/mocks'; // Import nguồn dữ liệu chuẩn
import { Promotion } from '@/types/types'; // Import type gốc từ DB
import { useEffect, useState } from 'react';

export interface PromotionDetail extends Promotion {
    title: string;      
    discountAmount: string; 
    expiryDate: string;  
    isActive: boolean;    
    description: string;
    bannerUrl: string;
    targetType: 'all' | 'specific_users';
    allowedUserIds: string[];
}

export const usePromotionDetail = (id: string | undefined) => {
    const [promotion, setPromotion] = useState<PromotionDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!id) {
            setPromotion(null);
            setLoading(false); 
            return;
        }

        const fetchDetail = async () => {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 500));
            const rawPromotion = mockPromotions.find((item) => item.id === id);

            if (rawPromotion) {
                const now = new Date();
                const endDate = new Date(rawPromotion.end_date);

                const formattedDiscount = rawPromotion.discount_type === 'percent'
                    ? `${rawPromotion.discount_value}%`
                    : `${new Intl.NumberFormat('vi-VN').format(rawPromotion.discount_value)}đ`;

                const mappedData: PromotionDetail = {
                    ...rawPromotion,
                    title: rawPromotion.name,
                    expiryDate: rawPromotion.end_date,
                    discountAmount: formattedDiscount,
                    isActive: endDate > now,
                    description: `Khuyến mãi ${rawPromotion.name} áp dụng cho toàn bộ dịch vụ.`,
                    bannerUrl: 'https://placehold.co/600x300?text=Promotion',
                    targetType: 'all',
                    allowedUserIds: [],
                };

                setPromotion(mappedData);
            } else {
                setPromotion(null);
            }

            setLoading(false);
        };

        fetchDetail();
    }, [id]);

    return { promotion, loading };
};