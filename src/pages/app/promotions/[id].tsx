import { usePromotionDetail } from '@/hooks/promotions/usePromotionDetail';
import Head from 'next/head';
import Image from 'next/image'; 
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Promotion {
    id: string;
    name: string;
    code: string;
    description: string;
    bannerUrl?: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    type: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: string;
    minOrderAmount: number;
    maxDiscountAmount: number;
    usageLimit?: number;
    conditions?: {
        newUsersOnly?: boolean;
    };
}

export default function PromotionDetailPage() {
    const router = useRouter();
    const { id } = router.query;

    // Ép kiểu cho hook để TypeScript nhận diện các thuộc tính
    const { promotion, loading } = usePromotionDetail(id as string) as {
        promotion: Promotion | null;
        loading: boolean
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Đang tải...</div>;
    if (!promotion) return <div className="min-h-screen flex items-center justify-center text-gray-500">Không tìm thấy khuyến mãi</div>;

    const isActive = promotion.isActive &&
        new Date(promotion.startDate) <= new Date() &&
        new Date(promotion.endDate) >= new Date();

    return (
        <>
            <Head>
                <title>{promotion.name} - Chi tiết ưu đãi</title>
            </Head>

            <div className="flex flex-col h-screen bg-gray-50 font-sans overflow-hidden">
                <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">

                    {/* Header Image Area */}
                    <div className="relative h-64 bg-gradient-to-br from-pink-500 to-purple-600 shrink-0">
                        <button
                            onClick={() => router.back()}
                            className="absolute top-4 left-4 z-10 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* 3. SỬA LỖI no-img-element bằng <Image /> */}
                        {promotion.bannerUrl ? (
                            <Image
                                src={promotion.bannerUrl}
                                alt={promotion.name}
                                fill
                                priority
                                className="object-cover opacity-80 mix-blend-overlay"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 5a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1V8a1 1 0 011-1zm5-5a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1H9a1 1 0 110-2h1V3a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </div>

                    <main className="max-w-3xl mx-auto -mt-6 relative px-4">
                        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{promotion.name}</h1>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>HSD: {new Date(promotion.endDate).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0 ml-4">
                                    <span className="block text-3xl font-bold text-pink-600">
                                        {promotion.type === 'percentage' ? `${promotion.discountValue}%` : `${(promotion.discountValue / 1000).toFixed(0)}K`}
                                    </span>
                                    <span className="text-xs text-gray-500 uppercase">Giảm giá</span>
                                </div>
                            </div>

                            <div className="border-t border-b border-gray-100 py-4 my-4">
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
                                    <div className="font-mono font-bold text-lg text-gray-800 tracking-wider">{promotion.code}</div>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(promotion.code);
                                            alert('Đã sao chép mã!');
                                        }}
                                        className="text-pink-600 font-semibold text-sm hover:text-pink-700 flex items-center gap-1"
                                    >
                                        Sao chép
                                    </button>
                                </div>
                            </div>

                            <div className="prose prose-sm max-w-none text-gray-600 mb-6">
                                <h3 className="text-gray-900 font-semibold mb-2 text-base">Chi tiết ưu đãi</h3>
                                <p className="whitespace-pre-line leading-relaxed">{promotion.description}</p>

                                <h3 className="text-gray-900 font-semibold mt-6 mb-2 text-base">Điều kiện áp dụng</h3>
                                <ul className="list-disc pl-5 space-y-1.5 marker:text-pink-500">
                                    {promotion.minOrderAmount > 0 && (
                                        <li>Đơn hàng tối thiểu: <span className="font-medium text-gray-800">{promotion.minOrderAmount.toLocaleString()}đ</span></li>
                                    )}
                                    {promotion.maxDiscountAmount > 0 && promotion.type === 'percentage' && (
                                        <li>Giảm tối đa: <span className="font-medium text-gray-800">{promotion.maxDiscountAmount.toLocaleString()}đ</span></li>
                                    )}
                                    <li>Áp dụng cho: {promotion.conditions?.newUsersOnly ? 'Khách hàng mới' : 'Tất cả khách hàng'}</li>
                                    <li>Số lượng: {promotion.usageLimit ? `${promotion.usageLimit} lượt` : 'Không giới hạn'}</li>
                                </ul>
                            </div>
                        </div>
                    </main>
                </div>

                <div className="flex-none bg-white border-t border-gray-200 p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="max-w-3xl mx-auto">
                        <Link
                            href={`/app/booking?promo=${promotion.code}`}
                            className={`block w-full text-center py-3.5 rounded-xl font-bold text-lg transition ${isActive
                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 shadow-lg shadow-pink-500/30'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            onClick={(e) => !isActive && e.preventDefault()}
                        >
                            {isActive ? 'Sử dụng ngay' : 'Hết hiệu lực'}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}