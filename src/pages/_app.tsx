import { useAuthStore } from '@/store/authStore';
import { useBusinessStore } from '@/store/businessStore';
import { usePromotionStore } from '@/store/promotionStore';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    // ======= HYDRATE AUTH STORE FROM LOCALSTORAGE =======
    hydrate();

    // ======= HYDRATE & FETCH BUSINESS CONFIG =======
    const { hydrate: hydrateBusiness, fetchConfig } = useBusinessStore.getState();
    hydrateBusiness();
    fetchConfig(); // Background fetch (SWR)

    // ======= HYDRATE & FETCH PROMOTIONS =======
    const { hydrate: hydratePromotions, fetchPromotions } = usePromotionStore.getState();
    hydratePromotions();
    fetchPromotions(); // Background fetch (SWR)

    // ======= REFERRAL DETECTION =======
    const detectReferral = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get('ref');

      if (refCode) {
        // Save referral code to localStorage
        localStorage.setItem('pendingReferralCode', refCode);
        console.log('✅ Referral code detected:', refCode);

        // Clean URL (remove ?ref=CODE)
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
      }
    };

    detectReferral();

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        // Fix lỗi: Xóa biến 'registration' không sử dụng
        .then(() => console.log('Service Worker registered'))
        .catch((error) => console.log('Service Worker registration failed:', error));
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    // Fix lỗi: Thêm 'hydrate' vào dependency array để đúng chuẩn React Hook
  }, [router.pathname, router.isReady, hydrate]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#0ea5e9" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <Toaster position="top-center" />
      </QueryClientProvider>
    </>
  );
}