import BottomNav from '@/components/BottomNav';
import { usePromotions } from '@/hooks/promotions/usePromotions';
import Head from 'next/head';
import Image from 'next/image'; // 1. Import component Image
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function PromotionsPage() {
  const router = useRouter();

  const {
    loading: isLoading,
    publicPromotions,
    privatePromotions
  } = usePromotions();

  const [activeTab, setActiveTab] = useState('all');

  const currentPromotions = activeTab === 'all' ? publicPromotions : privatePromotions;

  return (
    <>
      <Head>
        <title>Khuyến mãi - Booking App</title>
      </Head>

      <div className="flex flex-col h-screen bg-gray-50 overflow-hidden font-sans">
        <header className="bg-white shadow-sm sticky top-0 z-10 flex-none pb-2">
          <div className="max-w-7xl mx-auto px-4 pt-4 pb-2 flex items-center gap-4">
            <button onClick={() => router.push('/app')} className="text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900">Khuyến mãi</h1>
          </div>

          <div className="px-4 mt-2">
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setActiveTab('private')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-1 ${activeTab === 'private'
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <span>Dành cho bạn</span>
                <span className="text-xs">❤️</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto max-w-7xl w-full mx-auto px-4 py-6">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Đang tải...</div>
          ) : currentPromotions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center mt-10">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <p className="text-gray-500 mb-4">
                {activeTab === 'private'
                  ? "Hiện chưa có ưu đãi riêng nào dành cho bạn."
                  : "Hiện chưa có chương trình khuyến mãi nào"}
              </p>

              {activeTab === 'private' ? (
                <button
                  onClick={() => setActiveTab('all')}
                  className="text-cyan-600 font-medium hover:underline"
                >
                  Xem tất cả khuyến mãi
                </button>
              ) : (
                <Link href="/app" className="inline-block px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition">
                  Về trang chủ
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
              {currentPromotions.map((promo) => {
                const isActive = true;

                return (
                  <Link href={`/app/promotions/${promo.id}`} key={promo.id} className="block">
                    <div className={`relative rounded-xl overflow-hidden shadow-lg h-64 transition-transform hover:scale-[1.02] ${!isActive ? 'opacity-75 grayscale' : ''}`}>

                      <div className="absolute inset-0">
                        {/* 2. Thay thế <img> bằng <Image /> với thuộc tính fill */}
                        <Image
                          src={promo.bannerUrl}
                          alt={promo.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-purple-500/20 mix-blend-overlay"></div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 flex flex-col justify-end text-white">
                        <div className="flex justify-between items-end">
                          <div className="flex-1 mr-4">
                            <div className="flex items-center gap-2 mb-1">
                              {activeTab === 'private' && (
                                <span className="bg-yellow-500 text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">
                                  VIP
                                </span>
                              )}
                              <span className="bg-pink-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                                Giảm {promo.discountAmount}
                              </span>
                              <span className="text-xs text-gray-300">
                                HSD: {promo.expiryDate}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold leading-tight mb-1 line-clamp-1">{promo.title}</h3>
                            <p className="text-xs text-gray-600 line-clamp-2">{promo.description}</p>
                          </div>

                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono border border-white/30">
                              {promo.code}
                            </div>
                            <span className="text-xs font-semibold text-pink-400 flex items-center">
                              Chi tiết
                              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>

        <div className="flex-none bg-white border-t border-gray-100">
          <BottomNav />
        </div>
      </div>
    </>
  );
}