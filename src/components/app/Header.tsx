"use client";
import { useAuthHeader } from '@/hooks/auth/useAuthHeader';
import { Bell, ChevronDown, LogOut, Search, ShieldCheck, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// 1. Thêm định nghĩa kiểu dữ liệu cho Props
interface HeaderProps {
    userName?: string;
}

// 2. Nhận userName từ props
export default function Header({ userName }: HeaderProps) {
    const { user, logout } = useAuthHeader();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 h-20 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </nav>
    );

    // Ưu tiên dùng userName truyền từ props, nếu không có thì dùng user.name từ hook
    const displayDisplayName = userName || user.name;

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-20 flex justify-between items-center w-full">

                {/* Logo Section */}
                <div className="flex items-center gap-10">
                    <Link href="/app" className="transition-opacity hover:opacity-80 flex items-center gap-2">
                        <div className="relative w-9 h-9 sm:w-10 sm:h-10">
                            <Image src="/img/logo.png" alt="Logo" fill className="object-contain" priority />
                        </div>
                        <span className="text-xl font-bold tracking-tighter text-slate-900 hidden sm:block">
                            Tada<span className="text-blue-600">.</span>
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {/* Search & Bell */}
                    <div className="hidden md:flex items-center bg-slate-100 border border-slate-200 rounded-full px-4 py-2 gap-2 w-48 lg:w-64">
                        <Search size={16} className="text-slate-400" />
                        <input type="text" placeholder="Tìm kiếm..." className="bg-transparent text-xs outline-none w-full text-slate-900" />
                    </div>

                    <button className="p-2.5 bg-slate-100 rounded-full border border-slate-200 relative text-slate-600">
                        <Bell size={20} />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    {/* --- DROPDOWN USER --- */}
                    <div className="relative" ref={dropdownRef}>
                        <div
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center gap-2 sm:gap-3 pl-2 cursor-pointer select-none active:opacity-70 transition-all"
                        >
                            <div className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full border-2 border-white shadow-md flex items-center justify-center font-bold text-white uppercase transition-transform duration-300 ${isOpen ? 'scale-110' : ''}`}>
                                {displayDisplayName.charAt(0)}
                            </div>
                            <div className="hidden sm:block text-left">
                                {/* Sử dụng tên đã xử lý */}
                                <p className="text-xs font-bold text-slate-900 leading-none">{displayDisplayName}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{user.role}</p>
                                    <ChevronDown size={10} className={`text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
                                </div>
                            </div>
                        </div>

                        <div className={`absolute right-0 top-full mt-2 w-60 bg-white border border-slate-200 rounded-[24px] shadow-2xl z-[60] transition-all duration-300 ease-out origin-top-right
                            ${isOpen
                                ? 'opacity-100 visible translate-y-0 scale-100 pointer-events-auto'
                                : 'opacity-0 invisible translate-y-2 scale-95 pointer-events-none'
                            }`}>

                            <div className="p-5 border-b border-slate-100 bg-slate-50/50 rounded-t-[24px]">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-bold text-slate-900 truncate">{user.fullName || displayDisplayName}</p>
                                    {user.role === 'admin' && <ShieldCheck size={14} className="text-blue-500" />}
                                </div>
                                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                            </div>

                            <div className="p-2 space-y-1">
                                <Link href="/app/profile" className="block w-full text-left" onClick={() => setIsOpen(false)}>
                                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                                        <UserIcon size={16} /> Hồ sơ cá nhân
                                    </button>
                                </Link>
                                <div className="h-px bg-slate-100 my-1 mx-2" />
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        logout();
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-95"
                                >
                                    <LogOut size={16} /> Đăng xuất hệ thống
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}