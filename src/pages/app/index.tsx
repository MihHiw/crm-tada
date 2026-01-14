import BottomNav from '@/components/BottomNav';
import Header from '@/components/Header';
import { useAuthStore } from '@/store/authStore';
import { useBusinessStore } from '@/store/businessStore';
import { usePromotionStore } from '@/store/promotionStore';
import { useServiceStore } from '@/store/serviceStore';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

// --- Interfaces ---
interface Promotion {
  _id: string;
  name: string;
  type: 'percentage' | 'fixed';
  discountValue: number;
  description?: string;
  code: string;
}



export default function AppPage() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated, logout, fetchUser } = useAuthStore();
  const { config } = useBusinessStore();

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchUser();
    }
  }, [isAuthenticated, user, fetchUser]);

  useEffect(() => {
    const businessStore = useBusinessStore.getState();
    businessStore.hydrate();
    businessStore.fetchConfig();

    const promotionStore = usePromotionStore.getState();
    promotionStore.hydrate();
    promotionStore.fetchPromotions();

    const serviceStore = useServiceStore.getState();
    serviceStore.hydrate();
    serviceStore.fetchServices();
  }, []);

  useEffect(() => {
    if (router.isReady && !isAuthenticated && isHydrated) {
      router.push('/login');
    }
  }, [router.isReady, isAuthenticated, isHydrated, router]);

  const { promotions } = usePromotionStore();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Trang chủ - Booking App</title>
      </Head>

      <div className="min-h-screen bg-white flex flex-col font-sans text-gray-300">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header user={user} logout={logout} />
        </div>

        <main className="flex-1 pt-[85px] pb-[100px] px-4 w-full max-w-7xl mx-auto space-y-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-lg font-bold text-gray-800 mb-4 px-1">Tiện ích nhanh</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
              <Link href="/app/booking" className="bg-gradient-to-br from-stone-50 via-orange-100 to-amber-100 p-6 rounded-lg shadow-sm hover:shadow-md transition text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Đặt lịch</h3>
              </Link>

              <Link href="/app/referral" className="bg-gradient-to-br from-green-100 via-emerald-100 to-teal-200 p-6 rounded-lg shadow-sm hover:shadow-md transition text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-orange-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Mã giới thiệu</h3>
              </Link>

              {/* <Link href="/app/service" className="bg-gradient-to-b from-sky-100 to-blue-200 p-6 rounded-lg shadow-sm hover:shadow-md transition text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Đặt Dịch Vụ</h3>
              </Link> */}
            </div>

            {/* SECTION: KHUYẾN MÃI */}
            <section className="space-y-6">
              <div className="flex justify-between items-end px-1">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">🎁 Khuyến mãi & Ưu đãi</h2>
                  <p className="text-sm text-gray-500 mt-1">Săn deal hời, làm đẹp rạng ngời</p>
                </div>
                <Link href="/app/promotions" className="text-teal-600 hover:text-teal-700 text-sm font-semibold">
                  Xem tất cả →
                </Link>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-md relative group h-56 md:h-80 w-full">
                <Image
                  src={config?.banner || "/img/vanillabg.jpeg"}
                  alt="Banner"
                  fill
                  className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(promotions as Promotion[])?.slice(0, 3).map((promotion) => (
                  <div key={promotion._id} className="group bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-400 p-4 text-white flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{promotion.name}</h3>
                        <p className="text-white/80 text-xs mt-1">Mã: {promotion.code}</p>
                      </div>
                      <span className="bg-white text-pink-600 px-2 py-1 rounded-lg text-xs font-bold">
                        -{promotion.type === 'percentage' ? `${promotion.discountValue}%` : `${(promotion.discountValue / 1000).toFixed(0)}K`}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                      <p className="text-gray-600 text-sm line-clamp-2">{promotion.description}</p>
                      <Link href="/app/booking" className="w-full text-center py-2 bg-pink-50 text-pink-600 rounded-lg font-semibold text-sm hover:bg-pink-600 hover:text-white transition-all">
                        Dùng ngay
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 z-50">
          <BottomNav />
        </div>
      </div>
    </>
  );
}