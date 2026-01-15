"use client";

import { format, parseISO } from 'date-fns';
import React from 'react';

export interface ServiceHistoryItemFromHook {
    id: string;
    date: string;
    service_name: string;
    staff_name: string;
    price: number;
    status: string;
}

interface ServiceHistoryProps {
    history: ServiceHistoryItemFromHook[];
    hidePrice?: boolean;
}

const ServiceHistory: React.FC<ServiceHistoryProps> = ({ history, hidePrice = false }) => {

    const formatDate = (dateStr: string) => {
        try {
            return format(parseISO(dateStr), 'dd/MM/yyyy HH:mm');
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        {/* Header bảng trong suốt */}
                        <tr className="text-[10px] text-white/40 uppercase tracking-widest border-b border-white/10 bg-white/5">
                            <th className="py-4 pl-6 font-bold">Dịch vụ thực hiện</th>
                            <th className="py-4 font-bold">Thời gian</th>
                            <th className="py-4 font-bold">Nhân sự phụ trách</th>
                            {!hidePrice && <th className="py-4 font-bold">Chi phí</th>}
                            <th className="py-4 pr-6 font-bold text-center">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className="text-[13px]">
                        {history && history.length > 0 ? (
                            history.map((item) => (
                                <tr key={item.id} className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-none">
                                    <td className="py-4 pl-6 font-bold text-white group-hover:text-emerald-300 transition-colors">
                                        {item.service_name}
                                    </td>

                                    <td className="py-4 text-white/60 font-medium font-mono">
                                        {formatDate(item.date)}
                                    </td>

                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px] font-black uppercase border border-blue-500/30">
                                                {item.staff_name.charAt(0)}
                                            </div>
                                            <span className="text-white/80 font-bold text-xs">
                                                {item.staff_name}
                                            </span>
                                        </div>
                                    </td>

                                    {!hidePrice && (
                                        <td className="py-4 font-black text-emerald-400 tracking-tight">
                                            {item.price.toLocaleString('vi-VN')} đ
                                        </td>
                                    )}

                                    <td className="py-4 pr-6 text-center">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border ${['completed', 'success', 'Hoàn thành'].includes(item.status)
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : item.status === 'cancelled'
                                                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            }`}>
                                            {item.status === 'completed' ? 'Thành công' :
                                                item.status === 'confirmed' ? 'Đã hẹn' :
                                                    item.status === 'pending' ? 'Chờ duyệt' : item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={hidePrice ? 4 : 5} className="py-16 text-center text-white/20 font-medium italic">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                                            📋
                                        </div>
                                        Khách hàng chưa có lịch sử sử dụng dịch vụ
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ServiceHistory;