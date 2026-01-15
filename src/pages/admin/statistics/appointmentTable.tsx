"use client";

import { Sidebar } from "@/components/admin/Sidebar";
import GlobalBackground from '@/components/GlobalBackground';

import { ConsultationRequest, ConsultationStatus, useConsultationData } from '@/hooks/consultationData/useConsultationData';
import {
    Edit2,
    Mail,
    Phone,
    Search,
    Trash2,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const STATUS_MAP: Record<ConsultationStatus, { label: string, color: string }> = {
    PENDING: { label: 'Chờ xử lý', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    CONTACTED: { label: 'Đã liên hệ', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    UNREACHABLE: { label: 'Không nghe máy', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    APPOINTMENT: { label: 'Đã đặt lịch', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    SUCCESS: { label: 'Thành công', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-700 border-red-200' },
};

export default function ConsultationManagement() {
    const { data, loading, updateStatus, deleteRequest } = useConsultationData();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<ConsultationStatus | 'ALL'>('ALL');

    const filteredData = data.filter(item => {
        const matchesSearch = item.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.customer_phone.includes(searchTerm);
        const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) return (
        <div className="flex h-screen w-full items-center justify-center bg-rose-50/20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-rose-500 border-t-transparent"></div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#FFF5F7]/30 font-sans">
            <GlobalBackground />

            <Sidebar />
            <div className="flex-1 lg:ml-64 transition-all duration-300">
                <main className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Quản lý Tư vấn</h1>
                            <p className="text-slate-500 text-sm">Theo dõi và chăm sóc khách hàng tiềm năng</p>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-rose-100 flex flex-wrap gap-4 items-center">
                        <div className="relative flex-1 min-w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Tìm theo tên khách hàng hoặc số điện thoại..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-rose-300 transition-all text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                            <select
                                className="bg-transparent text-sm font-medium px-3 py-1 outline-none text-slate-600"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as ConsultationStatus | 'ALL')}
                            >
                                <option value="ALL">Tất cả trạng thái</option>
                                {Object.entries(STATUS_MAP).map(([key, val]) => (
                                    <option key={key} value={key}>{val.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-rose-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-rose-50/50 border-b border-rose-100">
                                    <tr className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                                        <th className="px-8 py-5">Khách hàng</th>
                                        <th className="px-6 py-5">Nội dung tư vấn</th>
                                        <th className="px-6 py-5">Ngày gửi</th>
                                        <th className="px-6 py-5 text-center">Trạng thái</th>
                                        <th className="px-8 py-5 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-rose-50/50">
                                    {filteredData.map((item) => (
                                        <ConsultationRow
                                            key={item.id}
                                            item={item}
                                            onUpdateStatus={updateStatus}
                                            onDelete={deleteRequest}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

interface RowProps {
    item: ConsultationRequest;
    onUpdateStatus: (id: string, status: ConsultationStatus, note: string) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

function ConsultationRow({ item, onUpdateStatus, onDelete }: RowProps) {
    const statusInfo = STATUS_MAP[item.status];

    return (
        <tr className="hover:bg-rose-50/20 transition-all group">
            <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                    <div className="relative w-11 h-11 flex-shrink-0">
                        <Image
                            src={item.customer_avatar || "https://i.pravatar.cc/150?u=guest"}
                            alt="avatar" fill className="rounded-2xl object-cover ring-2 ring-white shadow-sm"
                        />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">{item.customer_name}</p>
                        <div className="flex flex-col text-[11px] text-slate-400 mt-0.5">
                            <span className="flex items-center gap-1 font-medium"><Phone size={10} /> {item.customer_phone}</span>
                            {item.customer_email && <span className="flex items-center gap-1"><Mail size={10} /> {item.customer_email}</span>}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-5">
                <div className="max-w-[250px]">
                    {/* SỬA TẠI ĐÂY: Dùng item.content thay vì item.description */}
                    <p className="text-slate-600 line-clamp-2 italic">&#8220;{item.description || 'Yêu cầu tư vấn dịch vụ...'}&#8221;</p>
                    {item.history.length > 0 && (
                        <p className="text-[10px] text-rose-400 font-bold mt-1 uppercase tracking-tighter">
                            Ghi chú mới: {item.history[0].note}
                        </p>
                    )}
                </div>
            </td>
            <td className="px-6 py-5">
                <p className="font-medium text-slate-700">{new Date(item.created_at).toLocaleDateString('vi-VN')}</p>
                <p className="text-xs text-slate-400">{new Date(item.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
            </td>
            <td className="px-6 py-5 text-center">
                <select
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border outline-none transition-all cursor-pointer ${statusInfo.color}`}
                    value={item.status}
                    onChange={(e) => {
                        const note = window.prompt("Nhập ghi chú phản hồi:");
                        if (note !== null) onUpdateStatus(item.id, e.target.value as ConsultationStatus, note);
                    }}
                >
                    {Object.entries(STATUS_MAP).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                    ))}
                </select>
            </td>
            <td className="px-8 py-5 text-right">
                <div className="flex justify-end gap-2">
                    <button className="p-2 hover:bg-rose-100 text-rose-500 rounded-lg transition-colors" title="Chỉnh sửa">
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                        title="Xóa"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
}