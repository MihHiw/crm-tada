import { serviceAPI } from '@/lib/api';
import { create } from 'zustand';

// Định nghĩa interface cho Box thay vì dùng any
interface Box {
    id: string;
    [key: string]: unknown;
}

interface Service {
    _id: string;
    name: string;
    description?: string;
    price: number;
    duration: number;
    image?: string;
    category?: string;
    applicableBoxes?: Box[];
    maxBookingsPerDay?: number;
    isActive: boolean;
}

interface ServiceState {
    services: Service[];
    etag: string | null;
    isLoading: boolean;
    error: string | null;
    fetchServices: () => Promise<void>;
    hydrate: () => void;
}

export const useServiceStore = create<ServiceState>((set, get) => ({
    services: [],
    etag: null,
    isLoading: false,
    error: null,

    hydrate: () => {
        if (typeof window !== 'undefined') {
            const storedServices = localStorage.getItem('services-data');
            const storedEtag = localStorage.getItem('services-etag');

            if (storedServices) {
                try {
                    const services = JSON.parse(storedServices);
                    console.log('💆‍♀️ [ServiceStore] Hydrated from localStorage');
                    set({ services, etag: storedEtag });
                } catch (error) {
                    console.error('💆‍♀️ [ServiceStore] Failed to parse services:', error);
                    localStorage.removeItem('services-data');
                    localStorage.removeItem('services-etag');
                }
            }
        }
    },

    fetchServices: async () => {
        set({ isLoading: true });
        try {
            const currentEtag = get().etag;
            // Fix 55:28 - Thay any bằng kiểu Record cho headers
            const headers: Record<string, string> = {};

            if (currentEtag) {
                headers['If-None-Match'] = currentEtag;
            }

            const response = await serviceAPI.getAll({ headers, validateStatus: (status: number) => status < 400 });

            if (response.status === 304) {
                console.log('💆‍♀️ [ServiceStore] Services up to date (304)');
                set({ isLoading: false, error: null });
                return;
            }

            const services = response.data.data.services;
            const newEtag = response.headers['etag'] as string | undefined;

            if (typeof window !== 'undefined') {
                localStorage.setItem('services-data', JSON.stringify(services));
                if (newEtag) {
                    localStorage.setItem('services-etag', newEtag);
                }
            }

            console.log('💆‍♀️ [ServiceStore] Services updated from API (200)');
            set({ services, etag: newEtag ?? null, isLoading: false, error: null });

            // Fix 82:25 - Sử dụng unknown cho catch error
        } catch (error) {
            console.error('💆‍♀️ [ServiceStore] Failed to fetch services:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch services';
            set({
                error: errorMessage,
                isLoading: false
            });
        }
    },
}));