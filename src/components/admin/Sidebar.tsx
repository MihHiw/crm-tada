"use client";
import { useAuth } from '@/hooks/auth/useAuth'; // Import hook logout
import {
    Calendar,
    CircleDollarSign,
    FileText,
    LayoutGrid,
    LogOut,
    LucideIcon,
    Settings,
    Users
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItemType {
    id: string;
    label: string;
    icon: LucideIcon;
    href: string;
}

const MENU_ITEMS: MenuItemType[] = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutGrid, href: '/admin/dashboard' },
    { id: 'customers', label: 'Khách hàng', icon: Users, href: '/admin/customers/customer' },
    { id: 'transactions', label: 'Giao Dịch', icon: CircleDollarSign, href: '/admin/transaction' },
    { id: 'reports', label: 'Báo cáo', icon: FileText, href: '/admin/report' },
    { id: 'calendar', label: 'Lịch làm việc', icon: Calendar, href: '/admin/calendar' },
    { id: 'settings', label: 'Cài đặt', icon: Settings, href: '/admin/setting' },
];

export default function Sidebar({ adminName }: { adminName: string }) {
    const pathname = usePathname();
    const { logout } = useAuth(); // Sử dụng hàm logout từ hook

    return (
        <aside className="flex flex-col w-64 h-screen bg-[#0B0F1A] border-r border-gray-800 sticky top-0 overflow-hidden shrink-0">
            {/* Brand Header */}
            <Link href="/admin" className="flex items-center px-6 py-8 group cursor-pointer">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl shadow-lg shadow-blue-900/20 overflow-hidden border border-gray-800 group-hover:border-blue-500 transition-all">
                    <Image
                        src="/img/logo.png"
                        alt="Logo"
                        width={36}
                        height={36}
                        className="object-contain"
                    />
                </div>
                <span className="ml-3 font-bold text-white text-lg tracking-tight group-hover:text-blue-400 transition-colors">
                    Finance CRM
                </span>
            </Link>

            {/* Menu List */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                {MENU_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== '#' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`flex items-center px-4 py-3 transition-all duration-200 rounded-xl group
                                ${isActive
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold'
                                    : 'text-gray-400 hover:bg-gray-800/40 hover:text-white'
                                }`}
                        >
                            <Icon size={18} className={`mr-3 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                            <span className="text-[14px]">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer User Profile & Logout */}
            <div className="p-4 border-t border-gray-800/50">
                <div className="flex items-center p-3 rounded-2xl bg-[#161D2F]/50 border border-gray-800/50 group transition-all">
                    <div className="relative w-9 h-9 flex-shrink-0">
                        <Image
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                            alt="Admin Avatar"
                            fill
                            sizes="36px"
                            className="rounded-full object-cover border border-gray-700"
                        />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0B0F1A] rounded-full"></div>
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                        <p className="text-[13px] font-bold text-white truncate text-left">{adminName || "Quản trị viên"}</p>
                        <p className="text-[10px] text-gray-500 truncate text-left">Admin Portal</p>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={() => {
                            if (window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?")) {
                                logout();
                            }
                        }}
                        title="Đăng xuất"
                        className="ml-2 p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </aside>
    );
}