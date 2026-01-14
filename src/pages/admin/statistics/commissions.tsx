"use client";

import { Sidebar } from "@/components/admin/Sidebar";
import {
    CommissionRecord,
    StaffRole,
    useTechcommission
} from "@/hooks/techCommission/useTechcommission";
import {
    AlertCircle,
    Briefcase,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Download,
    Edit3,
    Star,
    Trash2
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
        <div className="min-h-screen bg-slate-50 flex font-sans">
            <Sidebar />

            <main className="flex-1 lg:ml-64 p-8 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý Hoa hồng</h1>
                        <p className="text-sm text-slate-500">Theo dõi doanh thu và quyết toán cho nhân sự hệ thống</p>
                    </div>
                    <button 
                        onClick={exportToExcel} 
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all text-sm font-semibold text-slate-700"
                    >
                        <Download size={18} className="text-slate-400" /> Xuất báo cáo Excel
                    </button>
                </div>

                {/* Stat Cards - Mapping động từ stats của hook */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard 
                        title={`TỔNG THỰC NHẬN (${activeTab.toUpperCase()})`} 
                        value={formatVND(stats?.[`${activeTab}Total` as keyof typeof stats] as number || 0)} 
                        badge={activeTab} 
                        badgeType="purple" 
                        icon={<Briefcase size={14} />} 
                    />
                    <StatCard 
                        title="ĐANG CHỜ DUYỆT" 
                        value={formatVND(stats?.[`${activeTab}Pending` as keyof typeof stats] as number || 0)} 
                        badge="Chưa chi" 
                        badgeType="warning" 
                        icon={<AlertCircle size={14} />} 
                    />
                    <StatCard 
                        title="NHÂN VIÊN XUẤT SẮC" 
                        value={activeTab === 'ktv' ? stats.topKTV.name : stats.topSaleActual.name} 
                        badge="Top 1" 
                        badgeType="success" 
                        icon={<Star size={14} />} 
                    />
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-1 p-1 bg-slate-200/50 w-fit rounded-xl border border-slate-200">
                    {(['ktv', 'sale', 'ctv'] as StaffRole[]).map((tab) => (
                        <button 
                            key={tab} 
                            onClick={() => { setActiveTab(tab); setCurrentPage(1); }} 
                            className={`flex items-center gap-2 px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                activeTab === tab 
                                ? "bg-white text-slate-900 shadow-sm border border-slate-100" 
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            {tab.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className={`h-1.5 w-full ${activeTab === 'ktv' ? "bg-purple-500" : activeTab === 'sale' ? "bg-blue-500" : "bg-emerald-500"}`} />
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50/50 text-slate-400 font-bold border-b border-slate-100 uppercase text-[10px] tracking-widest">
                                <tr>
                                    <th className="px-6 py-5">Thành viên</th>
                                    <th className="px-6 py-5">Nghiệp vụ / Mã GD</th>
                                    <th className="px-6 py-5">Hoa hồng</th>
                                    <th className="px-6 py-5 text-center">Trạng thái</th>
                                    <th className="px-6 py-5 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
                                                <span className="text-slate-400 font-medium italic">Đang đồng bộ dữ liệu...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : paginatedData.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center text-slate-400 italic">Không tìm thấy dữ liệu hoa hồng trong mục này.</td>
                                    </tr>
                                ) : (
                                    paginatedData.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-9 h-9">
                                                        <Image src={item.avatar || "https://i.pravatar.cc/150?u=none"} alt="avatar" fill className="rounded-full object-cover border border-slate-200" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{item.fullName}</p>
                                                        <p className="text-[10px] text-slate-400 font-medium">{item.phone}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-slate-700">{item.serviceName}</p>
                                                <p className="text-[10px] text-slate-400 font-mono">#{item.transactionCode}</p>
                                            </td>
                                            <td className="px-6 py-4 font-black text-slate-900 text-base">{formatVND(item.commission)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-tight ${
                                                    item.status === "completed" 
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                                                    : item.status === "cancelled"
                                                    ? "bg-slate-100 text-slate-500 border-slate-200"
                                                    : "bg-amber-50 text-amber-600 border-amber-100"
                                                }`}>
                                                    {item.status === "completed" ? "Đã trả" : item.status === "cancelled" ? "Đã hủy" : "Chờ chi"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setEditingItem(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Chỉnh sửa">
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button onClick={() => deleteCommission(item.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Xóa">
                                                        <Trash2 size={16} />
                                                    </button>
                                                    {item.status === "pending" && (
                                                        <button onClick={() => updateStatus(item.id, "completed")} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Duyệt thanh toán">
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
                    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium italic">
                            Hiển thị {paginatedData.length} trên {filteredData.length} bản ghi
                        </span>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-slate-900">Trang {currentPage} / {totalPages || 1}</span>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-30 hover:bg-slate-50 transition-all"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-30 hover:bg-slate-50 transition-all"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Edit */}
                {editingItem && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
                            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                                <h2 className="text-xl font-bold text-slate-900">Điều chỉnh hoa hồng</h2>
                                <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">Mã GD: {editingItem.transactionCode}</p>
                            </div>
                            <div className="p-8 space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest text-center">Số tiền hoa hồng mới (VNĐ)</label>
                                    <input 
                                        type="number" 
                                        autoFocus
                                        value={editingItem.commission} 
                                        onChange={(e) => setEditingItem({ ...editingItem, commission: Number(e.target.value) })} 
                                        className="w-full px-4 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-black text-3xl text-center text-slate-900 transition-all shadow-inner" 
                                    />
                                </div>
                                <div className="p-4 bg-blue-50 rounded-xl flex gap-3 items-start">
                                    <AlertCircle className="text-blue-500 shrink-0" size={18} />
                                    <p className="text-xs text-blue-700 leading-relaxed font-medium">Lưu ý: Việc thay đổi số tiền sẽ ảnh hưởng trực tiếp đến báo cáo doanh thu và tổng hoa hồng thực tế của nhân sự.</p>
                                </div>
                            </div>
                            <div className="p-8 flex gap-3 border-t border-slate-50">
                                <button onClick={() => setEditingItem(null)} className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">Hủy bỏ</button>
                                <button onClick={handleSaveEdit} className="flex-[2] py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all uppercase tracking-widest">Cập nhật ngay</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

// --- STAT CARD COMPONENT ---
function StatCard({ title, value, badge, badgeType, icon }: StatCardProps) {
    const typeColors: Record<BadgeType, string> = {
        success: "bg-emerald-50 text-emerald-600 border-emerald-100",
        warning: "bg-amber-50 text-amber-600 border-amber-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100"
    };
    
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
            <p className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-[0.2em]">{title}</p>
            <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-black text-slate-900 truncate">{value}</h3>
                <div className={`flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase whitespace-nowrap ${typeColors[badgeType]}`}>
                    {icon} {badge}
                </div>
            </div>
        </div>
    );
}