"use client";

import React from 'react';
import { Crown, Star, ShieldCheck, User } from 'lucide-react';

interface TierBadgeProps {
    tier: string;
}

const TierBadge: React.FC<TierBadgeProps> = ({ tier }) => {
    // Chuyển đổi về chữ thường để so sánh chính xác
    const tierKey = tier.toLowerCase();

    // Định nghĩa cấu hình UI cho từng hạng
    const tierConfig: Record<string, { 
        color: string; 
        bgColor: string; 
        borderColor: string; 
        icon: React.ReactNode; 
        label: string 
    }> = {
        'diamond': {
            label: 'Diamond',
            color: 'text-blue-700',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            icon: <Crown size={12} className="fill-blue-500" />
        },
        'gold': {
            label: 'Gold',
            color: 'text-amber-700',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            icon: <Star size={12} className="fill-amber-500" />
        },
        'silver': {
            label: 'Silver',
            color: 'text-slate-600',
            bgColor: 'bg-slate-50',
            borderColor: 'border-slate-200',
            icon: <ShieldCheck size={12} className="fill-slate-400" />
        },
        'vip': {
            label: 'VIP',
            color: 'text-rose-700',
            bgColor: 'bg-rose-50',
            borderColor: 'border-rose-200',
            icon: <Crown size={12} className="fill-rose-500" />
        },
        'default': {
            label: tier || 'Thành viên',
            color: 'text-gray-600',
            bgColor: 'bg-gray-100',
            borderColor: 'border-gray-200',
            icon: <User size={12} className="fill-gray-400" />
        }
    };

    // Lấy config dựa trên tier truyền vào, nếu không có thì dùng default
    const activeConfig = tierConfig[tierKey] || 
                        (tierKey.includes('vàng') ? tierConfig['gold'] : 
                         tierKey.includes('kim cương') ? tierConfig['diamond'] : 
                         tierKey.includes('bạc') ? tierConfig['silver'] : tierConfig['default']);

    return (
        <div className={`
            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-sm
            ${activeConfig.bgColor} ${activeConfig.borderColor} ${activeConfig.color}
            transition-all duration-300 hover:scale-105
        `}>
            <div className="shrink-0 flex items-center justify-center">
                {activeConfig.icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                {activeConfig.label}
            </span>
        </div>
    );
};

export default TierBadge;