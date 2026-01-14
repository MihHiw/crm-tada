"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link"; // 1. Import Link
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
        flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20 w-full rounded-lg
        ${isActive && "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"}
      `}
        >
            <div className="flex items-center gap-x-2 py-4">
                <Icon size={22} className={isActive ? "text-sky-700" : "text-slate-500"} />
                {label}
            </div>
        </Link>
    );
};