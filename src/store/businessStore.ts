import { businessAPI } from '@/lib/api';
import { create } from 'zustand';

interface BusinessConfig {
    name?: string;
    banner?: string;
    tagline?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    logo?: string;

    introduction?: string;
    contact?: {
        address?: string;
        phone?: string;
        email?: string;
        website?: string;
        socials?: {
            facebook?: string;
            zalo?: string;
            instagram?: string;
            telegram?: string;
        };
    };
    branding?: {
        logo?: string;
        banner?: string;
        primaryColor?: string;
        secondaryColor?: string;
    };
    services?: Array<{
        name: string;
        description?: string;
        price: number;
        image?: string;
        category?: string;
    }>;
}

interface BusinessState {
    config: BusinessConfig | null;
    etag: string | null;
    isLoading: boolean;
    error: string | null;
    fetchConfig: () => Promise<void>;
    hydrate: () => void;
}

export const useBusinessStore = create<BusinessState>((set, get) => ({
    config: null,
    etag: null,
    isLoading: false,
    error: null,

    hydrate: () => {
        if (typeof window !== 'undefined') {
            const storedConfig = localStorage.getItem('business-config');
            const storedEtag = localStorage.getItem('business-config-etag');

            if (storedConfig) {
                try {
                    const config = JSON.parse(storedConfig);
                    console.log('🏢 [BusinessStore] Hydrated from localStorage');
                    set({ config, etag: storedEtag });
                } catch (error) {
                    console.error('🏢 [BusinessStore] Failed to parse config:', error);
                    localStorage.removeItem('business-config');
                    localStorage.removeItem('business-config-etag');
                }
            }
        }
    },

    fetchConfig: async () => {
        set({ isLoading: true });
        try {
            const currentEtag = get().etag;
            // FIX 82:28 - Thay thế any bằng Record<string, string>
            const headers: Record<string, string> = {};

            if (currentEtag) {
                headers['If-None-Match'] = currentEtag;
            }

            const response = await businessAPI.getConfig({
                headers,
                validateStatus: (status: number) => status < 400
            });

            if (response.status === 304) {
                console.log('🏢 [BusinessStore] Config up to date (304)');
                set({ isLoading: false, error: null });
                return;
            }

            const config = response.data.data;
            const newEtag = response.headers['etag'] as string | undefined;

            if (typeof window !== 'undefined') {
                localStorage.setItem('business-config', JSON.stringify(config));
                if (newEtag) {
                    localStorage.setItem('business-config-etag', newEtag);
                }
            }

            console.log('🏢 [BusinessStore] Config updated from API (200)');
            set({ config, etag: newEtag ?? null, isLoading: false, error: null });

            // FIX 110:25 - Loại bỏ : any và xử lý lỗi an toàn
        } catch (error) {
            console.error('🏢 [BusinessStore] Failed to fetch config:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch business config';
            set({
                error: errorMessage,
                isLoading: false
            });
        }
    },
}));