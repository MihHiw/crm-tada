"use client";

import { useAuthStore } from '@/store/authStore';
import { useBusinessStore } from '@/store/businessStore';
import { usePromotionStore } from '@/store/promotionStore';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google'; // ✅ Thêm dòng này
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';

// Khởi tạo font Inter
const inter = Inter({ subsets: ['latin'] }); // ✅ Thêm dòng này

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
    hydrate();
    const { hydrate: hydrateBusiness, fetchConfig } = useBusinessStore.getState();
    hydrateBusiness();
    fetchConfig();
    const { hydrate: hydratePromotions, fetchPromotions } = usePromotionStore.getState();
    hydratePromotions();
    fetchPromotions();

    const detectReferral = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get('ref');
      if (refCode) {
        localStorage.setItem('pendingReferralCode', refCode);
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
      }
    };

    detectReferral();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker registered'))
        .catch((error) => console.log('Service Worker registration failed:', error));
    }

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
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
        {/* ✅ Bọc bằng thẻ main và inter.className để đồng bộ font toàn hệ thống */}
        <main className={inter.className}>
          <Component {...pageProps} />
        </main>
        <Toaster position="top-center" />
      </QueryClientProvider>
    </>
  );
}