import { userAPI } from '@/lib/api';
import Image from 'next/image'; // Import component Image của Next.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

// 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU CHUẨN (INTERFACE)
interface User {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    customerId?: string;
    // Đã xóa [key: string]: any; để tránh lỗi TypeScript
}

interface HeaderProps {
    user: User | null | undefined;
    logout: () => void;
}

export default function Header({ user, logout }: HeaderProps) {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path: string) => router.pathname === path;

    useEffect(() => {
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY < 50) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
                setIsOpen(false);
                setIsMobileMenuOpen(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, [lastScrollY]);

    const baseLinkClass = "text-[15px] font-medium transition-colors duration-200 hover:text-cyan-500";
    const getLinkClass = (path: string) =>
        `${baseLinkClass} ${isActive(path) ? 'text-cyan-500 font-semibold' : 'text-gray-600'}`;

    const getMobileLinkClass = (path: string) =>
        `block px-4 py-3 text-base font-medium rounded-md transition-colors ${isActive(path) ? 'bg-cyan-50 text-cyan-600' : 'text-gray-700 hover:bg-gray-50'}`;

    const { data: profileData } = useQuery('profile', () => userAPI.getProfile(), {
        enabled: !!user,
    });

    const profile = profileData?.data?.data?.user || user;

    const handleLogout = () => {
        if (confirm('Bạn có chắc muốn đăng xuất?')) {
            logout();
            router.push('/');
        }
    };

    return (
        <header
            className={`bg-white shadow-sm border-b border-gray-100 fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center bg-white relative z-50">
                {/* 1. LOGO - ĐÃ SỬA SANG <IMAGE /> */}
                <Link href="/app" className="flex items-center cursor-pointer group">
                    <div className="relative w-16 h-14">
                        <Image
                            src="/img/logo-vanila.png"
                            alt="Vanilla Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* 2. DESKTOP NAVIGATION */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="/app" className={getLinkClass('/app')}>Trang chủ</Link>
                    <Link href="/app/infor" className={getLinkClass('/app/infor')}>Về chúng tôi</Link>
                    <Link href="/app/contact" className={getLinkClass('/app/contact')}>Liên hệ</Link>
                </nav>

                {/* 3. RIGHT SECTION */}
                <div className="flex items-center gap-3">
                    <div className="hidden md:block">
                        <Link href="/app/booking">
                            <button className="bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg">
                                Đặt Lịch Ngay
                            </button>
                        </Link>
                    </div>

                    <div className="relative inline-block text-left">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-all focus:outline-none"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {isOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                                <div className="absolute right-0 mt-2 w-72 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden">
                                    <div className="border-b border-gray-100 bg-gray-50 overflow-hidden">
                                        <Link href="/app/profile" className="flex items-center justify-between p-4 active:bg-gray-200 transition-colors w-full cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                {/* Avatar tròn */}
                                                <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 shrink-0 border border-cyan-200">
                                                    <span className="font-bold text-xl uppercase">
                                                        {profile?.name?.charAt(0) || 'U'}
                                                    </span>
                                                </div>

                                                {/* Thông tin tên & email/sđt */}
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-bold text-gray-900 truncate">
                                                        {profile?.name || 'Khách hàng'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate max-w-[180px]">
                                                        {profile?.email || profile?.phone || 'Guest User'}
                                                    </p>
                                                </div>
                                            </div>


                                        </Link>
                                    </div>
                                    <div className="p-2">
                                        <button onClick={() => router.push('/app')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors">
                                            Quay lại App
                                        </button>
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors mt-1">
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            <div className={`md:hidden absolute top-20 left-0 right-0 bg-white border-b border-gray-100 shadow-lg transition-all duration-300 ease-in-out origin-top z-40 ${isMobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 h-0 overflow-hidden'
                }`}>
                <div className="px-4 py-4 space-y-2">
                    <Link href="/app" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/app')}>Trang chủ</Link>
                    <Link href="/app/infor" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/app/infor')}>Về chúng tôi</Link>
                    <Link href="/app/contact" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/app/contact')}>Liên hệ</Link>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-30 bg-black bg-opacity-25 md:hidden" style={{ top: '80px' }} onClick={() => setIsMobileMenuOpen(false)}></div>
            )}
        </header>
    );
}