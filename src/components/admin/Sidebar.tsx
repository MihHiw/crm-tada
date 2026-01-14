"use client";

import { SidebarItem } from "@/components/admin/SidebarItem";
import { mockRoles, mockUsers } from "@/mocks";
import { User } from '@/types/types';
import {
    ArrowLeftRight,
    BadgePercent,
    CalendarDays,
    ChevronRight,
    ClipboardList,
    Clock,
    Gift,
    LayoutDashboard,
    MessageSquare,
    ServerIcon,
    Sparkles,
    UserCog,
    Users,
    UsersRound,
    Wallet
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// ... (Giữ nguyên phần ROLES và MENU_GROUPS)
const ROLES = { ADMIN: 1, MANAGER: 2, STAFF: 3, CUSTOMER: 4 };
const MENU_GROUPS = [
    {
        groupLabel: "Tổng quan & Báo cáo",
        roleIds: [ROLES.ADMIN, ROLES.MANAGER],
        items: [
            { icon: Wallet, label: "Doanh thu & Tài chính", href: "/admin/statistics/revenue", roleIds: [ROLES.ADMIN] },
            { icon: ArrowLeftRight, label: "Quản lý Nạp & Rút", href: "/admin/statistics/transactions", roleIds: [ROLES.ADMIN] },
            { icon: LayoutDashboard, label: "Thống kê dịch vụ", href: "/admin/statistics/appointmentTable", roleIds: [ROLES.ADMIN, ROLES.MANAGER] },
            { icon: UserCog, label: "Tổng hợp hoa hồng", href: "/admin/statistics/commissions", roleIds: [ROLES.ADMIN] },
        ]
    },
    {
        groupLabel: "Nghiệp vụ",
        roleIds: [ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF],
        items: [
            { icon: MessageSquare, label: "Tư Vấn", href: "/admin/profession/consultation", roleIds: [ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF] },
            { icon: ClipboardList, label: "Mua dịch vụ", href: "/admin/profession/service", roleIds: [ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF] },
        ]
    },
    {
        groupLabel: "Quản trị",
        roleIds: [ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF],
        items: [
            { icon: UsersRound, label: "Khách hàng", href: "/admin/staff/customers", roleIds: [ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF] },
            { icon: CalendarDays, label: "Lịch hẹn", href: "/admin/staff/booking-management", roleIds: [ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF] },
            { icon: Gift, label: "Khuyến mãi", href: "/admin/staff/promotion-management", roleIds: [ROLES.ADMIN, ROLES.MANAGER] },
            { icon: Users, label: "Nhân Viên", href: "/admin/staff/staff-management", roleIds: [ROLES.ADMIN, ROLES.MANAGER] },
            { icon: ServerIcon, label: "Dịch vụ", href: "/admin/staff/service-management", roleIds: [ROLES.ADMIN, ROLES.MANAGER] }
        ]
    },
    {
        groupLabel: "Cài đặt hoa hồng",
        roleIds: [ROLES.ADMIN],
        items: [
            { icon: BadgePercent, label: "Hoa Hồng Nhân Viên", href: "/admin/staff/referral-management", roleIds: [ROLES.ADMIN] },
        ]
    },
    {
        groupLabel: "Hệ thống",
        roleIds: [ROLES.ADMIN],
        items: [
            { icon: Clock, label: "Giờ làm việc", href: "/admin/staff/operatingHoursPage", roleIds: [ROLES.ADMIN] },
        ]
    }
];

export const Sidebar = () => {
    const pathname = usePathname();
    const [currentUser, setCurrentUser] = useState<User | null>(mockUsers[0]);
    const [clickedGroupIndex, setClickedGroupIndex] = useState<number | null>(null);

    useEffect(() => {
        const activeIndex = MENU_GROUPS.findIndex(group =>
            group.items.some(item => item.href === pathname)
        );
        if (activeIndex !== -1) {
            const timer = setTimeout(() => {
                setClickedGroupIndex(activeIndex);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [pathname]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const storedUser = localStorage.getItem("currentUser");
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setCurrentUser(parsedUser);
                } catch (error) {
                    console.error("Lỗi đọc dữ liệu user:", error);
                }
            }
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const toggleGroup = (index: number) => {
        setClickedGroupIndex(prev => (prev === index ? null : index));
    };

    const hasPermission = (allowedRoleIds?: number[]) => {
        if (!allowedRoleIds || allowedRoleIds.length === 0) return true;
        if (!currentUser?.role_id) return false;
        return allowedRoleIds.includes(currentUser.role_id);
    };

    const displayRoleName = mockRoles.find(r => r.id === currentUser?.role_id)?.name || "Người dùng";

    return (
        // 👇 1. SỬA MÀU CHỮ CHÍNH: text-white
        <aside className="w-64 bg-[#0f172a] text-white flex flex-col fixed h-full z-20 shadow-xl border-r border-[#1e293b] font-sans transition-all duration-300">

            {/* Phần Logo */}
            <div className="h-20 flex flex-col items-center justify-center border-b border-[#1e293b] relative overflow-hidden flex-shrink-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl"></div>
                <Link href="/admin" className="relative z-10">
                    <div className="relative h-32 w-32">
                        <Image src="/img/logo-vanila.png" alt="Logo" fill className="object-contain brightness-0 invert" priority />
                    </div>
                </Link>
            </div>

            {/* Phần Menu */}
            <div className="flex-1 py-6 px-4 overflow-y-auto custom-scrollbar space-y-4">
                {MENU_GROUPS.map((group, index) => {
                    if (!hasPermission(group.roleIds)) return null;
                    const visibleItems = group.items.filter(item => hasPermission(item.roleIds));
                    if (visibleItems.length === 0) return null;

                    const isOpen = clickedGroupIndex === index;

                    return (
                        <div key={index} className="select-none">
                            <div
                                onClick={() => toggleGroup(index)}
                                className={`px-4 mb-2 flex items-center justify-between cursor-pointer group/label hover:bg-[#1e293b] p-2 rounded-lg transition-all ${isOpen ? "bg-[#1e293b]" : ""}`}
                            >
                                <div className="flex items-center gap-2 opacity-80 group-hover/label:opacity-100">
                                    {/* 👇 Icon màu trắng */}
                                    <Sparkles size={10} className="text-white" />
                                    {/* 👇 Chữ Label màu trắng */}
                                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] text-white`}>
                                        {group.groupLabel}
                                    </p>
                                </div>
                                {/* 👇 Mũi tên màu trắng (có độ trong suốt nhẹ khi chưa active) */}
                                <ChevronRight size={14} className={`text-white/70 transition-transform duration-300 ${isOpen ? "rotate-90 text-white" : ""}`} />
                            </div>

                            <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100 mb-4" : "max-h-0 opacity-0"}`}>
                                {visibleItems.map((item) => (
                                    <SidebarItem
                                        key={item.href}
                                        icon={item.icon}
                                        label={item.label}
                                        href={item.href}

                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 👇 SỬA MÀU CHỮ USER PROFILE */}
            <div className="p-4 bg-gradient-to-t from-[#020617] to-transparent mt-auto">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#1e293b]/50 border border-[#334155] shadow-sm backdrop-blur-sm">
                    <div className="relative w-10 h-10">
                        <Image
                            src={currentUser?.avatar_url || "https://i.pravatar.cc/150?img=11"}
                            alt="Avatar" fill className="rounded-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#1e293b] rounded-full"></span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        {/* 👇 Tên user màu trắng tinh */}
                        <p className="text-sm font-bold text-white truncate">{currentUser?.full_name || "User"}</p>
                        {/* 👇 Role màu trắng mờ */}
                        <p className="text-[10px] text-white/70 uppercase">{displayRoleName}</p>
                    </div>
                </div>
                {/* 👇 Nút đăng xuất vẫn giữ màu đỏ nhạt để cảnh báo, nhưng sáng hơn để hợp nền tối */}
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg mt-2 transition-colors">
                    Đăng xuất
                </button>
            </div>
        </aside>
    );
};