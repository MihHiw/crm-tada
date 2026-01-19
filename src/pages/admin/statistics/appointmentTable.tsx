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

// CẬP NHẬT: Màu sắc trạng thái dạng Neon/Dark mode
const STATUS_MAP: Record<ConsultationStatus, { label: string, color: string }> = {
    PENDING: { label: 'Chờ xử lý', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    CONTACTED: { label: 'Đã liên hệ', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    UNREACHABLE: { label: 'Không nghe máy', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
    APPOINTMENT: { label: 'Đã đặt lịch', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    SUCCESS: { label: 'Thành công', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    CANCELLED: { label: 'Đã hủy', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
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
        <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-slate-300">
            <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
                <p className="text-sm font-medium animate-pulse">Đang tải dữ liệu...</p>
            </div>
        </div>
    );

    return (
        // FIX: Layout h-screen overflow-hidden để cố định sidebar
        <div className="flex h-screen w-full overflow-hidden font-sans text-slate-200">
            <GlobalBackground />

            {/* Sidebar Container */}
            <div className="w-[260px] flex-shrink-0 h-full border-r border-white/10 bg-slate-900/60 backdrop-blur-xl z-20">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 h-full overflow-y-auto relative z-10 scrollbar-hide">
                
                {/* FIX: Container căn trái (mr-auto) và padding (p-6) */}
                <div className="w-full max-w-[1600px] mr-auto p-6 space-y-8">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Quản lý tư vấn</h1>
                            <p className="text-white/60 text-sm font-medium">Theo dõi và chăm sóc khách hàng tiềm năng.</p>
                        </div>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/10 flex flex-wrap gap-4 items-center">
                        <div className="relative flex-1 min-w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Tìm theo tên khách hàng hoặc số điện thoại..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-white/5 rounded-xl outline-none focus:border-indigo-400 focus:bg-slate-900/70 transition-all text-sm text-white placeholder:text-slate-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-xl border border-white/5">
                            <select
                                className="bg-transparent text-sm font-medium px-3 py-1.5 outline-none text-slate-300 cursor-pointer [&>option]:bg-slate-900 [&>option]:text-slate-200"
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

                    {/* Table Container */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col min-h-[500px]">
                        <div className="overflow-x-auto flex-1 custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white/5 border-b border-white/10 sticky top-0 z-10 backdrop-blur-md">
                                    <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="px-8 py-5">Khách hàng</th>
                                        <th className="px-6 py-5">Nội dung tư vấn</th>
                                        <th className="px-6 py-5">Ngày gửi</th>
                                        <th className="px-6 py-5 text-center">Trạng thái</th>
                                        <th className="px-8 py-5 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-white/5">
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
                            {filteredData.length === 0 && (
                                <div className="text-center py-20 text-slate-500 italic">
                                    <div className="flex flex-col items-center gap-3">
                                        <Search size={32} className="opacity-50" />
                                        <p>Không tìm thấy dữ liệu nào phù hợp.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}</style>
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
        <tr className="hover:bg-white/5 transition-colors group">
            <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                    <div className="relative w-11 h-11 flex-shrink-0">
                        <Image
                            src={item.customer_avatar || "https://i.pravatar.cc/150?u=guest"}
                            alt="avatar"
                            fill
                            className="rounded-full object-cover ring-2 ring-white/20 shadow-lg"
                        />
                    </div>
                    <div>
                        <p className="font-semibold text-white">{item.customer_name}</p>
                        <div className="flex flex-col text-[11px] text-slate-400 mt-1 gap-0.5">
                            <span className="flex items-center gap-1.5"><Phone size={10} className="text-indigo-400" /> {item.customer_phone}</span>
                            {item.customer_email && <span className="flex items-center gap-1.5"><Mail size={10} className="text-indigo-400" /> {item.customer_email}</span>}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-5">
                <div className="max-w-[300px]">
                    <p className="text-slate-300 line-clamp-2 italic text-xs leading-relaxed opacity-90">
                        &#8220;{item.description || 'Yêu cầu tư vấn dịch vụ...'}&#8221;
                    </p>
                    {item.history.length > 0 && (
                        <p className="text-[10px] text-indigo-300 font-bold mt-2 uppercase tracking-wide flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full inline-block animate-pulse"></span>
                            Note: {item.history[0].note}
                        </p>
                    )}
                </div>
            </td>
            <td className="px-6 py-5">
                <p className="font-medium text-slate-200">{new Date(item.created_at).toLocaleDateString('vi-VN')}</p>
                <p className="text-xs text-slate-500 mt-0.5">{new Date(item.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
            </td>
            <td className="px-6 py-5 text-center">
                <select
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-full border outline-none transition-all cursor-pointer appearance-none text-center min-w-[130px] [&>option]:bg-slate-900 [&>option]:text-slate-200 ${statusInfo.color}`}
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
                <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-colors" title="Chỉnh sửa">
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                        title="Xóa"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
}