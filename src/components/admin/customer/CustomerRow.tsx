"use client";

import ActionButton from '@/components/admin/ActionButton';
import { CustomerTableRow } from '@/hooks/customerManagement/useCustomerManagement';
import { format, parseISO } from 'date-fns';
import { CalendarClock, Mail, MoreVertical, Phone, TrendingUp, Wallet } from 'lucide-react';
import Image from 'next/image';
import React, { memo } from 'react';
import TierBadge from '../TierBadge';

interface CustomerRowProps {
    customer: CustomerTableRow;
    onRowClick: (id: string | number) => void;
    onFormatCurrency: (val: number) => string;
}

const CustomerRow = memo(({ customer, onRowClick, onFormatCurrency }: CustomerRowProps) => {

    const handleActionClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const formatLastVisit = (dateStr: string) => {
        if (!dateStr) return "Chưa ghé thăm";
        try {
            return format(parseISO(dateStr), 'dd/MM/yyyy');
        } catch {
            return dateStr;
        }
    };

    return (
        <tr
            onClick={() => onRowClick(customer.id)}
            // THAY ĐỔI: hover:bg-white/10 (kính mờ), border-white/5 (viền mờ)
            className="group hover:bg-white/10 transition-all duration-200 cursor-pointer border-b border-white/5 last:border-none"
        >
            {/* Cột 1: Thông tin khách hàng */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 flex-shrink-0">
                        <Image
                            src={customer.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=random`}
                            alt={customer.name}
                            fill
                            sizes="40px"
                            // THAY ĐỔI: border-white/20
                            className="rounded-full object-cover border border-white/20 shadow-sm group-hover:scale-105 transition-transform"
                        />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#1e293b] ${customer.status === 'active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                    </div>
                    <div className="min-w-0 text-left">
                        {/* THAY ĐỔI: text-white */}
                        <p className="text-sm font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                            {customer.name}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-white/60 mt-0.5">
                            <span className="flex items-center gap-1 font-medium">
                                <Phone size={10} className="text-white/40" />
                                {customer.phone}
                            </span>
                        </div>
                    </div>
                </div>
            </td>

            {/* Cột 2: Hạng thành viên */}
            <td className="px-6 py-4 text-center">
                <TierBadge tier={customer.tier} />
            </td>

            {/* Cột 3: Ví Tiền */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col text-left">
                    {/* THAY ĐỔI: text-emerald-300 (sáng hơn để nổi trên nền tối) */}
                    <span className="text-sm font-bold text-emerald-300 flex items-center gap-1">
                        {onFormatCurrency(customer.wallet_balance)}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-white/40 mt-0.5 font-medium">
                        <Wallet size={10} className="text-white/30" />
                        <span>Sẵn có trong ví</span>
                    </div>
                </div>
            </td>

            {/* Cột 4: Tổng Chi Tiêu */}
            <td className="px-6 py-4 whitespace-nowrap text-left">
                <div className="flex flex-col">
                    {/* THAY ĐỔI: text-white */}
                    <span className="text-sm font-black text-white">
                        {onFormatCurrency(customer.total_spending)}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-white/40 mt-0.5 font-medium">
                        <TrendingUp size={10} className="text-blue-300" />
                        <span>{customer.visit_count} lần sử dụng dịch vụ</span>
                    </div>
                </div>
            </td>

            {/* Cột 5: Lần cuối ghé */}
            <td className="px-6 py-4 whitespace-nowrap">
                {/* THAY ĐỔI: text-white/70 */}
                <div className="flex items-center gap-1.5 text-white/70 text-xs font-semibold">
                    <CalendarClock size={14} className="text-white/30" />
                    <span>{formatLastVisit(customer.last_visit)}</span>
                </div>
            </td>

            {/* Cột 6: Thao tác */}
            <td className="px-6 py-4 text-right whitespace-nowrap">
                <div className="flex justify-end items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <div onClick={handleActionClick}>
                        <ActionButton
                            onClick={() => window.open(`mailto:${customer.email}`)}
                            icon={<Mail size={15} />}
                            color="blue"
                            title="Gửi Email"
                        />
                    </div>
                    <button
                        onClick={handleActionClick}
                        // THAY ĐỔI: hover:bg-white/10, text-white/40
                        className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-colors focus:outline-none"
                    >
                        <MoreVertical size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );
});

CustomerRow.displayName = 'CustomerRow';

export default CustomerRow;