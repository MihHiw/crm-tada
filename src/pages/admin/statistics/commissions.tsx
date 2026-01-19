"use client";

import { Sidebar } from "@/components/admin/Sidebar";
import GlobalBackground from '@/components/GlobalBackground';
import {
    CommissionRecord,
    StaffRole,
    useTechcommission
} from "@/hooks/techCommission/useTechcommission";
import {
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Download,
    Edit3,
    Star,
    Trash2,
    Wallet
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";


// --- ĐỊNH NGHĨA UI TYPES ---
type BadgeType = 'success' | 'warning' | 'purple' | 'blue' | 'emerald';

interface StatCardProps {
    title: string;
    value: string | number;
    badge: string;
    badgeType: BadgeType;
    icon: React.ReactNode;
}

export default function CommissionPage() {
    const {
        commissions,
        loading,
        stats,
        exportToExcel,
        updateStatus,
        deleteCommission,
        editCommission
    } = useTechcommission();

    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState<StaffRole>('ktv');
    const [editingItem, setEditingItem] = useState<CommissionRecord | null>(null);
    const pageSize = 5;

    // --- XỬ LÝ FORMAT ---
    const formatVND = (amount: number) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(amount);

    // --- LOGIC PHÂN TRANG & LỌC ---
    const filteredData = useMemo(() =>
        commissions.filter(i => i.role === activeTab),
        [commissions, activeTab]);

    const totalPages = Math.ceil(filteredData.length / pageSize);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, currentPage]);

    // --- ACTIONS HANDLERS ---
    const handleSaveEdit = async () => {
        if (editingItem) {
            await editCommission(editingItem.id, editingItem.commission);
            setEditingItem(null);
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden font-sans text-slate-200">
            {/* Background Layer */}
            <GlobalBackground />

            {/* Sidebar with Glass Effect */}
            <div className="w-[260px] flex-shrink-0 h-full border-r border-white/5 bg-slate-900/60 backdrop-blur-xl z-20">
                <Sidebar />
            </div>

            <main className="flex-1 h-full overflow-y-auto relative z-10 scrollbar-hide">
                {/* FIX: Đổi mx-auto thành mr-auto và giảm padding để kéo nội dung sang trái */}
                <div className="max-w-[1400px] mr-auto p-6 space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Quản Lý hoa hồng</h1>
                            <p className="text-sm text-slate-400 font-medium">Theo dõi doanh thu và quyết toán cho nhân sự hệ thống.</p>
                        </div>

                        <button
                            onClick={exportToExcel}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 shadow-lg transition-all text-sm font-semibold text-white backdrop-blur-md group"
                        >
                            <Download size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" /> Xuất báo cáo Excel
                        </button>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            title={`TỔNG THỰC NHẬN (${activeTab.toUpperCase()})`}
                            value={formatVND(stats?.[`${activeTab}Total` as keyof typeof stats] as number || 0)}
                            badge={activeTab.toUpperCase()}
                            badgeType="purple"
                            icon={<Wallet size={16} />}
                        />
                        <StatCard
                            title="ĐANG CHỜ DUYỆT"
                            value={formatVND(stats?.[`${activeTab}Pending` as keyof typeof stats] as number || 0)}
                            badge="Chờ chi"
                            badgeType="warning"
                            icon={<AlertCircle size={16} />}
                        />
                        <StatCard
                            title="NHÂN VIÊN XUẤT SẮC"
                            value={activeTab === 'ktv' ? stats.topKTV.name : stats.topSaleActual.name}
                            badge="Top 1"
                            badgeType="success"
                            icon={<Star size={16} />}
                        />
                    </div>

                    {/* Tab Switcher & Table Container */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">

                        {/* Toolbar */}
                        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex gap-1 p-1 bg-black/20 rounded-xl border border-white/5">
                                {(['ktv', 'sale', 'ctv'] as StaffRole[]).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                                        className={`px-6 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wide ${activeTab === tab
                                            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Decorative Line based on Tab */}
                            <div className={`h-1 w-24 rounded-full ${activeTab === 'ktv' ? "bg-purple-500" : activeTab === 'sale' ? "bg-blue-500" : "bg-emerald-500"} shadow-[0_0_15px_rgba(var(--color),0.5)]`} />
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-black/10 text-slate-400 font-bold border-b border-white/5 uppercase text-[10px] tracking-widest">
                                    <tr>
                                        <th className="px-8 py-5">Thành viên</th>
                                        <th className="px-6 py-5">Nghiệp vụ / Mã GD</th>
                                        <th className="px-6 py-5">Hoa hồng</th>
                                        <th className="px-6 py-5 text-center">Trạng thái</th>
                                        <th className="px-6 py-5 text-right">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="p-20 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-8 h-8 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
                                                    <span className="text-slate-500 text-xs uppercase font-bold tracking-widest">Đang tải dữ liệu...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : paginatedData.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-20 text-center text-slate-500 italic">Không tìm thấy dữ liệu.</td>
                                        </tr>
                                    ) : (
                                        paginatedData.map((item) => (
                                            <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-8 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative w-10 h-10">
                                                            <Image
                                                                src={item.avatar || "https://i.pravatar.cc/150?u=none"}
                                                                alt="avatar"
                                                                fill
                                                                className="rounded-full object-cover border-2 border-white/10 group-hover:border-indigo-500 transition-colors"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-white">{item.fullName}</p>
                                                            <p className="text-[11px] text-slate-400 font-medium">{item.phone}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-slate-300">{item.serviceName}</p>
                                                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">#{item.transactionCode}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-white text-base tracking-tight">{formatVND(item.commission)}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${item.status === "completed"
                                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                        : item.status === "cancelled"
                                                            ? "bg-slate-500/10 text-slate-400 border-slate-500/20"
                                                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                                        }`}>
                                                        {item.status === "completed" ? "Đã trả" : item.status === "cancelled" ? "Đã hủy" : "Chờ chi"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => setEditingItem(item)} className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all" title="Chỉnh sửa">
                                                            <Edit3 size={16} />
                                                        </button>
                                                        <button onClick={() => deleteCommission(item.id)} className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-all" title="Xóa">
                                                            <Trash2 size={16} />
                                                        </button>
                                                        {item.status === "pending" && (
                                                            <button onClick={() => updateStatus(item.id, "completed")} className="p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all" title="Duyệt thanh toán">
                                                                <CheckCircle2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-black/10">
                            <span className="text-xs text-slate-500 font-medium">
                                Hiển thị {paginatedData.length} / {filteredData.length} bản ghi
                            </span>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-slate-300">Trang {currentPage} của {totalPages || 1}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 disabled:opacity-30 hover:bg-white/10 transition-all"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 disabled:opacity-30 hover:bg-white/10 transition-all"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal Edit (Dark Mode) */}
                    {editingItem && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                            <div className="bg-[#1e293b] rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden border border-white/10">
                                <div className="p-6 border-b border-white/5 bg-white/5">
                                    <h2 className="text-lg font-bold text-white">Điều chỉnh hoa hồng</h2>
                                    <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider">GD: #{editingItem.transactionCode}</p>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest text-center">Số tiền hoa hồng (VNĐ)</label>
                                        <input
                                            type="number"
                                            autoFocus
                                            value={editingItem.commission}
                                            onChange={(e) => setEditingItem({ ...editingItem, commission: Number(e.target.value) })}
                                            className="w-full px-4 py-4 bg-black/30 border border-white/10 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-bold text-2xl text-center text-white transition-all"
                                        />
                                    </div>
                                    <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex gap-3 items-start">
                                        <AlertCircle className="text-indigo-400 shrink-0 mt-0.5" size={16} />
                                        <p className="text-xs text-indigo-300 leading-relaxed">Thay đổi này sẽ cập nhật ngay lập tức vào báo cáo doanh thu của nhân viên.</p>
                                    </div>
                                </div>
                                <div className="p-6 flex gap-3 border-t border-white/5 bg-black/20">
                                    <button onClick={() => setEditingItem(null)} className="flex-1 py-3 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider transition-colors">Hủy bỏ</button>
                                    <button onClick={handleSaveEdit} className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/40 hover:bg-indigo-500 transition-all uppercase tracking-wider">Lưu thay đổi</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// --- STAT CARD COMPONENT (Glass Style) ---
function StatCard({ title, value, badge, badgeType, icon }: StatCardProps) {
    const typeColors: Record<BadgeType, string> = {
        success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    };

    return (
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl p-6 rounded-[24px] border border-white/10 shadow-xl group hover:bg-white/10 transition-all duration-300">
            {/* Glow effect */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
                    <div className={`p-2 rounded-lg ${typeColors[badgeType].split(' ')[0]} ${typeColors[badgeType].split(' ')[1]}`}>
                        {icon}
                    </div>
                </div>

                <div className="flex items-end justify-between gap-2">
                    <h3 className="text-2xl font-bold text-white truncate tracking-tight">{value}</h3>
                    <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md border uppercase whitespace-nowrap mb-1 ${typeColors[badgeType]}`}>
                        {badge}
                    </div>
                </div>
            </div>
        </div>
    );
}