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

// Định nghĩa mapping Role ID để code dễ đọc hơn
const ROLES = {
    ADMIN: 1,
    MANAGER: 2,
    STAFF: 3, // Kỹ thuật viên / Nhân viên
    CUSTOMER: 4
};

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

    // --- SỬA LỖI 1: Xử lý Active Menu ---
    useEffect(() => {
        // Tìm group đang active
        const activeIndex = MENU_GROUPS.findIndex(group =>
            group.items.some(item => item.href === pathname)
        );

        // Chỉ update nếu index thay đổi và chưa đúng
        // Sử dụng setTimeout để tránh update synchronous gây lỗi
        if (activeIndex !== -1 && activeIndex !== clickedGroupIndex) {
            const timer = setTimeout(() => {
                setClickedGroupIndex(activeIndex);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

    // --- SỬA LỖI 2: Xử lý LocalStorage ---
    useEffect(() => {
        // Đẩy xuống cuối hàng đợi render
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

    // Hàm kiểm tra quyền dựa trên role_id
    const hasPermission = (allowedRoleIds?: number[]) => {
        if (!allowedRoleIds || allowedRoleIds.length === 0) return true;
        if (!currentUser?.role_id) return false;
        return allowedRoleIds.includes(currentUser.role_id);
    };

    const displayRoleName = mockRoles.find(r => r.id === currentUser?.role_id)?.name || "Người dùng";

    return (
        <aside className="w-64 bg-museBg text-slate-600 flex flex-col fixed h-full z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-rose-100 font-sans">
            <div className="h-20 flex flex-col items-center justify-center border-b border-rose-50 relative overflow-hidden flex-shrink-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-rose-200/30 rounded-full blur-2xl"></div>
                <Link href="/admin" className="relative z-10">
                    <div className="relative h-16 w-32">
                        <Image src="/img/logo-vanila.png" alt="Logo" fill className="object-contain" priority />
                    </div>
                </Link>
            </div>

            <div className="flex-1 py-6 px-4 overflow-y-auto custom-scrollbar space-y-4">
                {MENU_GROUPS.map((group, index) => {
                    // Kiểm tra quyền hiển thị Group
                    if (!hasPermission(group.roleIds)) return null;

                    // Lọc các Items bên trong mà user có quyền xem
                    const visibleItems = group.items.filter(item => hasPermission(item.roleIds));
                    if (visibleItems.length === 0) return null;

                    const isOpen = clickedGroupIndex === index;

                    return (
                        <div key={index} className="select-none">
                            <div
                                onClick={() => toggleGroup(index)}
                                className={`px-4 mb-2 flex items-center justify-between cursor-pointer group/label hover:bg-rose-50 p-2 rounded-lg transition-all ${isOpen ? "bg-rose-50/80" : ""}`}
                            >
                                <div className="flex items-center gap-2 opacity-80 group-hover/label:opacity-100">
                                    <Sparkles size={10} className="text-rose-400" />
                                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isOpen ? "text-rose-600" : "text-rose-400"}`}>
                                        {group.groupLabel}
                                    </p>
                                </div>
                                <ChevronRight size={14} className={`text-rose-400 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} />
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

            <div className="p-4 bg-gradient-to-t from-rose-50/50 to-transparent mt-auto">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-rose-100 shadow-sm">
                    <div className="relative w-10 h-10">
                        <Image
                            src={currentUser?.avatar_url || "https://i.pravatar.cc/150?img=11"}
                            alt="Avatar" fill className="rounded-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 truncate">{currentUser?.full_name || "User"}</p>
                        <p className="text-[10px] text-slate-400 uppercase">{displayRoleName}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg mt-2 transition-colors">
                    Đăng xuất
                </button>
            </div>
        </aside>
    );
};