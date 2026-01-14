"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    href: string;
}

export const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
    const pathname = usePathname();

    // Kiểm tra active
    const isActive = pathname === href || pathname?.startsWith(`${href}/`);

    return (
        <Link
            href={href}
            className={`
                group flex items-center gap-x-2 text-sm font-[500] pl-6 transition-all w-full rounded-lg
                
                /* 👇 1. TRẠNG THÁI THƯỜNG (INACTIVE) */
                /* Text màu xám sáng (Slate-400) để dịu mắt, Hover vào thì sáng trắng lên */
                text-slate-400 hover:text-white hover:bg-white/10

                /* 👇 2. TRẠNG THÁI ACTIVE */
                /* Text trắng tinh, Nền màu xanh nổi bật (Blue-600) */
                ${isActive && "text-white bg-blue-600 hover:bg-blue-700 shadow-md"}
            `}
        >
            <div className="flex items-center gap-x-2 py-4">
                {/* 👇 3. ICON: Đổi màu theo trạng thái */}
                <Icon
                    size={22}
                    className={`transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}
                />
                {label}
            </div>
        </Link>
    );
};