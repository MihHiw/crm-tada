import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function useBookingAuth() {
    const router = useRouter();
    const { user, isAuthenticated, isHydrated } = useAuthStore();

    useEffect(() => {
        if (!router.isReady) return;
        if (!isAuthenticated && isHydrated) {
            router.push('/login');
        }
    }, [router.isReady, isAuthenticated, isHydrated, router]);

    return { user, isAuthenticated };
}