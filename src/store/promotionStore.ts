import { promotionAPI } from '@/lib/api';
import { create } from 'zustand';

// Định nghĩa interface cụ thể thay vì dùng any
interface ApplicableService {
    serviceId: string;
    serviceName?: string;
}

interface Promotion {
    _id: string;
    name: string;
    description?: string;
    code: string;
    type: 'percentage' | 'fixed';
    discountValue: number;
    startDate: string;
    endDate: string;
    usageLimit?: number;
    usageCount: number;
    // Fix 15:26 - Thay any[] bằng interface hoặc string[] tùy thuộc vào dữ liệu thật
    applicableServices?: ApplicableService[];
}

interface PromotionState {
    promotions: Promotion[];
    etag: string | null;
    isLoading: boolean;
    error: string | null;
    fetchPromotions: () => Promise<void>;
    hydrate: () => void;
}

export const usePromotionStore = create<PromotionState>((set, get) => ({
    promotions: [],
    etag: null,
    isLoading: false,
    error: null,

    hydrate: () => {
        if (typeof window !== 'undefined') {
            const storedPromotions = localStorage.getItem('promotions-data');
            const storedEtag = localStorage.getItem('promotions-etag');

            if (storedPromotions) {
                try {
                    const allPromotions: Promotion[] = JSON.parse(storedPromotions);
                    const now = new Date();
                    const promotions = allPromotions.filter((p) => new Date(p.endDate) >= now);

                    console.log('🎁 [PromotionStore] Hydrated from localStorage', {
                        total: allPromotions.length,
                        valid: promotions.length
                    });
                    set({ promotions, etag: storedEtag });
                } catch (error) {
                    console.error('🎁 [PromotionStore] Failed to parse promotions:', error);
                    localStorage.removeItem('promotions-data');
                    localStorage.removeItem('promotions-etag');
                }
            }
        }
    },

    fetchPromotions: async () => {
        set({ isLoading: true });
        try {
            const currentEtag = get().etag;
            // Fix 63:28 - Sử dụng Record cho Headers thay vì any
            const headers: Record<string, string> = {};

            if (currentEtag) {
                headers['If-None-Match'] = currentEtag;
            }

            const response = await promotionAPI.getAll({ headers, validateStatus: (status: number) => status < 400 });

            if (response.status === 304) {
                console.log('🎁 [PromotionStore] Promotions up to date (304)');
                set({ isLoading: false, error: null });
                return;
            }

            const promotions = response.data.data.promotions;
            const newEtag = response.headers['etag'] as string | undefined;

            if (typeof window !== 'undefined') {
                localStorage.setItem('promotions-data', JSON.stringify(promotions));
                if (newEtag) {
                    localStorage.setItem('promotions-etag', newEtag);
                }
            }

            console.log('🎁 [PromotionStore] Promotions updated from API (200)');
            set({ promotions, etag: newEtag ?? null, isLoading: false, error: null });

            // Fix 90:25 - Xử lý error unknown thay vì any
        } catch (error) {
            console.error('🎁 [PromotionStore] Failed to fetch promotions:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch promotions';
            set({
                error: errorMessage,
                isLoading: false
            });
        }
    },
}));