"use client";

import { format, parseISO } from 'date-fns';
import React from 'react';

/**
 * Interface khớp hoàn toàn với dữ liệu trả về từ Hook useCustomerDetail
 */
export interface ServiceHistoryItemFromHook {
    id: string;
    date: string;       // Chuỗi ISO từ start_time
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

    /**
     * Hàm format ngày tháng an toàn
     */
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
                        <tr className="text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-50 bg-gray-50/30">
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
                                <tr key={item.id} className="group hover:bg-[#F8F9FA] transition-colors border-b border-gray-50 last:border-none">
                                    {/* Sửa lỗi: Dùng service_name thay cho service */}
                                    <td className="py-4 pl-6 font-bold text-[#2D3748]">
                                        {item.service_name}
                                    </td>

                                    <td className="py-4 text-gray-500 font-medium">
                                        {formatDate(item.date)}
                                    </td>

                                    {/* Sửa lỗi: Dùng staff_name thay cho staff */}
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black uppercase shadow-sm">
                                                {item.staff_name.charAt(0)}
                                            </div>
                                            <span className="text-[#4A5568] font-bold">
                                                {item.staff_name}
                                            </span>
                                        </div>
                                    </td>

                                    {!hidePrice && (
                                        <td className="py-4 font-black text-[#1A202C]">
                                            {item.price.toLocaleString('vi-VN')} đ
                                        </td>
                                    )}

                                    <td className="py-4 pr-6 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border shadow-sm ${['completed', 'success', 'Hoàn thành'].includes(item.status)
                                                ? 'bg-[#F0FFF4] text-[#38A169] border-[#C6F6D5]'
                                                : item.status === 'cancelled'
                                                    ? 'bg-red-50 text-red-500 border-red-100'
                                                    : 'bg-amber-50 text-amber-600 border-amber-100'
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
                                <td colSpan={hidePrice ? 4 : 5} className="py-16 text-center text-gray-300 font-medium italic">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
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