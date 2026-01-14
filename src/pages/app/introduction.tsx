import { useBusinessStore } from '@/store/businessStore';
import Head from 'next/head';
import Image from 'next/image'; // 1. Import next/image
import { useRouter } from 'next/router';
import React, { useState } from 'react';
// 1. Định nghĩa Interface cho các props của InfoRow
interface InfoRowProps {
    icon: React.ReactNode;
    subIcon?: React.ReactNode;
    text?: string | null;
    placeholder: string;
    isLink?: boolean;
    href?: string;
}

export default function IntroductionPage() {
    const router = useRouter();
    const { config } = useBusinessStore();
    const [imgSrc, setImgSrc] = useState<string | null>(config?.banner || null);

    const fallbackImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';
    return (
        <>
            <Head>
                <title>Giới thiệu - {config?.name || 'Booking App'}</title>
            </Head>

            <div className="min-h-screen bg-gray-50 font-sans">
                {/* 1. Header - Glassmorphism style */}
                <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
                    <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-lg font-bold text-gray-800">Giới thiệu</h1>
                    </div>
                </header>

                <main className="pb-20">
                    {/* 2. Modern Banner Area */}
                    <div className="relative h-64 w-full bg-gray-200">
                        {config?.banner ? (
                            <>
                                <Image
                                    src={imgSrc || fallbackImage}
                                    alt="Cover"
                                    fill // Giúp ảnh lấp đầy div cha
                                    className="object-cover" // Tương đương object-cover
                                    priority // Ưu tiên tải cho LCP (vì đây là ảnh đầu trang)
                                    onError={() => setImgSrc(fallbackImage)} // Xử lý lỗi ảnh
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
                            </>
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                                <span className="text-white text-4xl font-bold opacity-30 tracking-widest uppercase">
                                    {config?.name?.substring(0, 2) || 'BN'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* 3. Floating Business Card */}
                    <div className="max-w-3xl mx-auto px-4 -mt-16 relative z-10">
                        <div className="bg-white rounded-2xl shadow-xl p-6 ring-1 ring-black/5">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
                                        {config?.name || 'Tên Doanh Nghiệp'}
                                    </h2>
                                    <p className="text-gray-500 mt-1 font-medium">
                                        {config?.tagline || 'Slogan hoặc mô tả ngắn gọn về dịch vụ.'}
                                    </p>
                                </div>
                                {config?.phone && (
                                    <a href={`tel:${config.phone}`} className="flex-shrink-0 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition active:scale-95 text-center">
                                        Liên hệ ngay
                                    </a>
                                )}
                            </div>

                            <hr className="my-6 border-gray-100" />

                            <div className="space-y-4">
                                <InfoRow
                                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />}
                                    subIcon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />}
                                    text={config?.address}
                                    placeholder="Chưa cập nhật địa chỉ"
                                />
                                <InfoRow
                                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />}
                                    text={config?.phone}
                                    placeholder="Chưa cập nhật số điện thoại"
                                    isLink={true}
                                    href={`tel:${config?.phone}`}
                                />
                                <InfoRow
                                    icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                                    text={config?.email}
                                    placeholder="Chưa cập nhật Email"
                                    isLink={true}
                                    href={`mailto:${config?.email}`}
                                />
                            </div>
                        </div>

                        {/* 4. Introduction Content */}
                        {config?.introduction && (
                            <div className="mt-6 bg-white rounded-2xl shadow-sm p-6 ring-1 ring-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                                    Về chúng tôi
                                </h3>
                                <div
                                    className="prose prose-slate max-w-none 
                                    prose-headings:font-bold prose-headings:text-gray-800 
                                    prose-p:text-gray-600 prose-p:leading-relaxed
                                    prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
                                    prose-img:rounded-xl"
                                    dangerouslySetInnerHTML={{ __html: config.introduction }}
                                />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}

// 2. Cập nhật kiểu dữ liệu cho component InfoRow
const InfoRow = ({ icon, subIcon, text, placeholder, isLink, href }: InfoRowProps) => {
    if (!text) return null;

    const Content = () => (
        <div className="flex items-start gap-4 group">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icon}
                    {subIcon}
                </svg>
            </div>
            <div className="flex-1 pt-2">
                <p className={`text-sm text-gray-600 font-medium ${isLink ? 'group-hover:text-indigo-600 transition-colors' : ''}`}>
                    {text || placeholder}
                </p>
            </div>
        </div>
    );

    return isLink ? (
        <a href={href} className="block">
            <Content />
        </a>
    ) : (
        <Content />
    );
};