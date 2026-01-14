"use client";
import { Sidebar } from '@/components/admin/Sidebar';
import { PromotionUI, usePromotions } from '@/hooks/promotions/usePromotionAdmin';
import {
    Calendar,
    CheckCircle2,
    Clock,
    Edit,
    Plus,
    Save,
    Search,
    Ticket,
    Trash2,
    X,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

// --- Types cho UI (Đã đồng bộ với Hook) ---
interface UIPromotion extends PromotionUI {
    status: 'active' | 'hidden' | 'expired' | 'expiring_soon';
    usageCount: number;
}

type TabType = 'all' | 'active' | 'expired' | 'hidden';

interface PromotionFormData {
    id?: string;
    name: string;
    code: string;
    value: string;
    endDate: string;
    bannerUrl: string;
}

const initialFormState: PromotionFormData = {
    name: '',
    code: '',
    value: '',
    endDate: '',
    bannerUrl: '',
};

const StatusBadge = ({ status }: { status: UIPromotion['status'] }) => {
    const configs = {
        active: { color: 'bg-green-50 text-green-600 border-green-100', text: 'Đang chạy' },
        hidden: { color: 'bg-gray-100 text-gray-500 border-gray-200', text: 'Đang ẩn' },
        expired: { color: 'bg-red-50 text-red-500 border-red-100', text: 'Đã kết thúc' },
        expiring_soon: { color: 'bg-orange-50 text-orange-600 border-orange-100', text: 'Sắp hết hạn' },
    };
    const config = configs[status] || configs.hidden;
    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${config.color} uppercase tracking-wider whitespace-nowrap`}>
            {config.text}
        </span>
    );
};

export default function PromotionManagement() {
    const { loading, allPromotions, stats: hookStats } = usePromotions();

    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<PromotionFormData>(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const uiPromotions: UIPromotion[] = useMemo(() => {
        if (!allPromotions) return [];

        return allPromotions.map((item): UIPromotion => {
            const now = new Date();
            const expiryObj = new Date(item.expiryDate);
            const daysUntilExpiry = Math.ceil((expiryObj.getTime() - now.getTime()) / (1000 * 3600 * 24));

            let status: UIPromotion['status'] = 'active';

            if (!item.isActive) {
                status = 'hidden';
            } else if (expiryObj < now) {
                status = 'expired';
            } else if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
                status = 'expiring_soon';
            }

            return {
                ...item,
                status: status,
                usageCount: Math.floor(Math.random() * 200) + 10, // Mock usage count
            };
        });
    }, [allPromotions]);

    const filteredPromotions = useMemo(() => {
        return uiPromotions.filter(p => {
            const matchesSearch =
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.code.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;
            if (activeTab === 'all') return true;
            if (activeTab === 'active') return p.status === 'active' || p.status === 'expiring_soon';
            if (activeTab === 'expired') return p.status === 'expired';
            if (activeTab === 'hidden') return p.status === 'hidden';
            return true;
        });
    }, [uiPromotions, searchTerm, activeTab]);

    // --- Pagination Logic ---
    useEffect(() => { setCurrentPage(1); }, [searchTerm, activeTab]);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPromotions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);

    const handleOpenCreate = () => {
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (promo: UIPromotion) => {
        setFormData({
            id: promo.id,
            name: promo.name,
            code: promo.code,
            value: promo.discountAmount,
            endDate: promo.expiryDate,
            bannerUrl: promo.bannerUrl,
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsModalOpen(false);
        }, 1000);
    };

    return (
        <div className="flex h-screen bg-[#FFF5F7] font-sans text-gray-800 overflow-hidden">
            <Head><title>Quản lý khuyến mãi | Vanilla Spa</title></Head>
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden lg:ml-64">
                <header className="bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center shadow-sm z-10">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Chiến dịch Khuyến mãi</h1>
                        <p className="text-xs text-gray-500 font-medium">Theo dõi hiệu quả và cấu hình mã giảm giá hệ thống.</p>
                    </div>
                    <button
                        onClick={handleOpenCreate}
                        className="bg-[#A33446] hover:bg-[#8E2836] text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-[#A33446]/20 flex items-center gap-2 transition-all active:scale-95"
                    >
                        <Plus size={18} />
                        Tạo khuyến mãi
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {/* Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shadow-inner">
                                <CheckCircle2 size={28} />
                            </div>
                            <div>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Đang hoạt động</p>
                                <p className="text-3xl font-black text-gray-800">{loading ? '...' : hookStats.active}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-inner">
                                <Clock size={28} />
                            </div>
                            <div>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Hết hạn / Ẩn</p>
                                <p className="text-3xl font-black text-gray-800">{loading ? '...' : hookStats.inactive}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner">
                                <Ticket size={28} />
                            </div>
                            <div>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Tổng chương trình</p>
                                <p className="text-3xl font-black text-gray-800">{loading ? '...' : hookStats.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-50 flex flex-col lg:row justify-between items-center gap-6">
                            <div className="flex bg-gray-100/60 p-1.5 rounded-2xl w-full lg:w-auto">
                                {[
                                    { id: 'all', label: 'Tất cả' },
                                    { id: 'active', label: 'Đang chạy' },
                                    { id: 'expired', label: 'Đã kết thúc' },
                                    { id: 'hidden', label: 'Đang ẩn' }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as TabType)}
                                        className={`flex-1 lg:flex-none px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id
                                            ? 'bg-white text-gray-900 shadow-sm'
                                            : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="relative w-full lg:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm mã hoặc tên..."
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50/50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#A33446]/20 focus:bg-white transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-[0.15em] border-b border-gray-50">
                                    <tr>
                                        <th className="px-8 py-5">Nội dung chiến dịch</th>
                                        <th className="px-6 py-5 text-center">Mã Code</th>
                                        <th className="px-6 py-5 text-center">Giá trị</th>
                                        <th className="px-6 py-5">Thời hạn</th>
                                        <th className="px-6 py-5 text-center">Trạng thái</th>
                                        <th className="px-8 py-5 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading ? (
                                        <tr><td colSpan={6} className="py-20 text-center font-bold text-gray-400 animate-pulse">Đang tải dữ liệu khuyến mãi...</td></tr>
                                    ) : currentItems.length > 0 ? (
                                        currentItems.map((promo) => (
                                            <tr key={promo.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex-shrink-0">
                                                            <Image src={promo.bannerUrl} alt={promo.name} fill className="object-cover" sizes="56px" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-gray-900 text-sm truncate">{promo.name}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${promo.targetType === 'all' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                                                                    {promo.targetType === 'all' ? 'Public' : 'VIP Only'}
                                                                </span>
                                                                <span className="text-[10px] text-gray-400 font-medium">{promo.usageCount} lượt dùng</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className="bg-gray-900 text-white px-3 py-1.5 rounded-xl text-xs font-mono font-black tracking-widest">
                                                        {promo.code}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className="text-sm font-black text-[#A33446]">{promo.discountAmount}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-0.5">
                                                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                                                            <Calendar size={12} className="text-gray-400" />
                                                            {new Date(promo.expiryDate).toLocaleDateString('vi-VN')}
                                                        </div>
                                                        <p className="text-[9px] text-gray-400 font-medium">Bắt đầu: {new Date(promo.startDate).toLocaleDateString('vi-VN')}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <StatusBadge status={promo.status} />
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                        <button onClick={() => handleOpenEdit(promo)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Edit size={16} /></button>
                                                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={6} className="py-24 text-center text-gray-400 font-bold italic">Không có chương trình nào phù hợp.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredPromotions.length > 0 && (
                            <div className="px-8 py-5 border-t border-gray-50 bg-gray-50/30 flex justify-between items-center">
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                    Trang {currentPage} / {totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-30 transition-all shadow-sm"
                                    ><ChevronLeft size={18} /></button>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-30 transition-all shadow-sm"
                                    ><ChevronRight size={18} /></button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* CRUD Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
                            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                <h3 className="font-black text-xl text-gray-900 tracking-tight">
                                    {formData.id ? 'Hiệu chỉnh khuyến mãi' : 'Tạo chiến dịch mới'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full text-gray-400 transition-all"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSave} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Tên chương trình hiển thị</label>
                                        <input type="text" required className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#A33446]/20 outline-none transition-all font-bold" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Mã định danh (Code)</label>
                                        <input type="text" required className="w-full px-5 py-3.5 rounded-2xl bg-gray-900 text-white border border-gray-800 outline-none font-mono font-black tracking-widest uppercase" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Giá trị giảm</label>
                                        <input type="text" required className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 outline-none font-black text-[#A33446]" value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} />
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-all">Đóng</button>
                                    <button type="submit" disabled={isSubmitting} className="flex-1 py-4 rounded-2xl bg-[#A33446] text-white text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-[#A33446]/30 hover:bg-[#8E2836] transition-all flex justify-center items-center gap-2">
                                        {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={16} /> Lưu cấu hình</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}