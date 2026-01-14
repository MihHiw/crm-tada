"use client";

import ActionButton from '@/components/admin/ActionButton';
import { CustomerTableRow } from '@/hooks/customerManagement/useCustomerManagement';
import { format, parseISO } from 'date-fns';
import { CalendarClock, Mail, MoreVertical, Phone, TrendingUp, Wallet } from 'lucide-react';
import Image from 'next/image';
import React, { memo } from 'react';
import TierBadge from '../TierBadge';

interface CustomerRowProps {
    customer: CustomerTableRow; // Sử dụng trực tiếp type từ Hook để đồng bộ dữ liệu
    onRowClick: (id: string | number) => void;
    onFormatCurrency: (val: number) => string;
}

const CustomerRow = memo(({ customer, onRowClick, onFormatCurrency }: CustomerRowProps) => {

    const handleActionClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Ngăn sự kiện click dòng khi bấm vào nút thao tác
    };

    // Hàm xử lý format ngày tháng an toàn từ start_time của hook
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
            className="group hover:bg-slate-50 transition-all duration-200 cursor-pointer border-b border-gray-50 last:border-none"
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
                            className="rounded-full object-cover border border-gray-100 shadow-sm group-hover:scale-105 transition-transform"
                        />
                        {/* Dot hiển thị trạng thái hoạt động */}
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${customer.status === 'active' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                    </div>
                    <div className="min-w-0 text-left">
                        <p className="text-sm font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                            {customer.name}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                            <span className="flex items-center gap-1 font-medium">
                                <Phone size={10} className="text-gray-300" />
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
                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                        {onFormatCurrency(customer.wallet_balance)}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5 font-medium">
                        <Wallet size={10} className="text-gray-400" />
                        <span>Sẵn có trong ví</span>
                    </div>
                </div>
            </td>

            {/* Cột 4: Tổng Chi Tiêu */}
            <td className="px-6 py-4 whitespace-nowrap text-left">
                <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-700">
                        {onFormatCurrency(customer.total_spending)}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5 font-medium">
                        <TrendingUp size={10} className="text-blue-400" />
                        <span>{customer.visit_count} lần sử dụng dịch vụ</span>
                    </div>
                </div>
            </td>

            {/* Cột 5: Lần cuối ghé */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                    <CalendarClock size={14} className="text-slate-300" />
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
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
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