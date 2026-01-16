"use client";
import { Sidebar } from '@/components/admin/Sidebar';
import GlobalBackground from '@/components/GlobalBackground';
// Giả sử hook này trả về data đúng chuẩn Promotion, nếu chưa bạn cần sửa hook hoặc map data ở đây
import { usePromotions } from '@/hooks/promotions/usePromotionAdmin';
import { Promotion } from '@/types/types'; // Import Interface chuẩn của bạn
import {
    Calendar,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Edit,
    Percent,
    Plus,
    Save,
    Search,
    Ticket,
    Trash2,
    X
} from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

// --- Types UI Mở rộng từ Interface gốc ---
interface UIPromotion extends Promotion {
    status: 'active' | 'upcoming' | 'expired' | 'hidden'; // Trạng thái tính toán
    usageCount: number; // Mock data hiển thị
}

type TabType = 'all' | 'active' | 'upcoming' | 'expired';

// Form Data map chính xác với Promotion
interface PromotionFormData {
    id?: string;
    name: string;
    code: string;
    discount_type: 'percent' | 'fixed';
    discount_value: number;
    start_date: string;
    end_date: string;
    banner_url: string;
    target_type: 'all' | 'specific';
}

const initialFormState: PromotionFormData = {
    name: '',
    code: '',
    discount_type: 'fixed',
    discount_value: 0,
    start_date: '',
    end_date: '',
    banner_url: '',
    target_type: 'all',
};

// --- Badge Component ---
const StatusBadge = ({ status }: { status: UIPromotion['status'] }) => {
    const configs = {
        active: { color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', text: 'Đang chạy' },
        upcoming: { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', text: 'Sắp diễn ra' },
        expired: { color: 'bg-rose-500/20 text-rose-300 border-rose-500/30', text: 'Đã kết thúc' },
        hidden: { color: 'bg-white/10 text-white/50 border-white/10', text: 'Đang ẩn' },
    };
    const config = configs[status] || configs.hidden;
    return (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${config.color} uppercase tracking-wider whitespace-nowrap`}>
            {config.text}
        </span>
    );
};

export default function PromotionManagement() {
    // Giả sử hook trả về any hoặc Promotion[], ta ép kiểu để an toàn
    const { loading, allPromotions } = usePromotions();

    // State quản lý danh sách hiển thị (Local State)
    const [localPromotions, setLocalPromotions] = useState<Promotion[]>([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<PromotionFormData>(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Đồng bộ dữ liệu từ Hook
    useEffect(() => {
        if (allPromotions && allPromotions.length > 0) {
            // Ép kiểu data từ hook về Promotion nếu cần thiết
            setLocalPromotions(allPromotions as unknown as Promotion[]);
        }
    }, [allPromotions]);

    // Tính toán trạng thái UI (Derived State)
    const uiPromotions: UIPromotion[] = useMemo(() => {
        return localPromotions.map((item): UIPromotion => {
            const now = new Date().getTime();
            const start = new Date(item.start_date).getTime();
            const end = new Date(item.end_date).getTime();

            let status: UIPromotion['status'] = 'active';

            if (now < start) {
                status = 'upcoming';
            } else if (now > end) {
                status = 'expired';
            } else {
                status = 'active';
            }

            return {
                ...item,
                status: status,
                usageCount: Math.floor(Math.random() * 200) + 10, // Mock usage
            };
        });
    }, [localPromotions]);

    // Filter Logic
    const filteredPromotions = useMemo(() => {
        return uiPromotions.filter(p => {
            const matchesSearch =
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.code.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;
            if (activeTab === 'all') return true;
            return p.status === activeTab;
        });
    }, [uiPromotions, searchTerm, activeTab]);

    // Pagination
    useEffect(() => { setCurrentPage(1); }, [searchTerm, activeTab]);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPromotions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);

    // Handlers
    const handleOpenCreate = () => {
        // Set default dates
        const now = new Date();
        const nextMonth = new Date();
        nextMonth.setDate(now.getDate() + 30);

        setFormData({
            ...initialFormState,
            start_date: now.toISOString().slice(0, 16), // Format cho input datetime-local
            end_date: nextMonth.toISOString().slice(0, 16)
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (promo: UIPromotion) => {
        setFormData({
            id: promo.id,
            name: promo.name,
            code: promo.code,
            discount_type: promo.discount_type,
            discount_value: promo.discount_value,
            start_date: new Date(promo.start_date).toISOString().slice(0, 16),
            end_date: new Date(promo.end_date).toISOString().slice(0, 16),
            banner_url: promo.banner_url || '',
            target_type: promo.target_type,
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            const newPromotion: Promotion = {
                id: formData.id || Math.random().toString(36).substr(2, 9),
                name: formData.name,
                code: formData.code.toUpperCase(),
                discount_type: formData.discount_type,
                discount_value: Number(formData.discount_value),
                start_date: new Date(formData.start_date).toISOString(),
                end_date: new Date(formData.end_date).toISOString(),
                banner_url: formData.banner_url || "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&auto=format&fit=crop&q=60",
                target_type: formData.target_type,
                // Các trường optional khác
                description: '',
                min_order_value: 0,
                max_discount_value: 0,
                usage_limit: 100,
                applicable_users: []
            };

            if (formData.id) {
                setLocalPromotions(prev => prev.map(p => p.id === formData.id ? { ...p, ...newPromotion } : p));
            } else {
                setLocalPromotions(prev => [newPromotion, ...prev]);
            }

            setIsSubmitting(false);
            setIsModalOpen(false);
        }, 600);
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    return (
        <div className="flex h-screen w-full overflow-hidden font-sans text-white">
            <GlobalBackground />
            <Head><title>Quản lý khuyến mãi | Vanilla Spa</title></Head>

            <div className="w-[260px] flex-shrink-0 h-full border-r border-white/10 bg-slate-900/60 backdrop-blur-xl z-20">
                <Sidebar />
            </div>

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10 scrollbar-hide">
                {/* Header */}
                <header className="bg-transparent border-b border-white/10 px-8 py-5 flex justify-between items-center z-10 backdrop-blur-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Chiến dịch khuyến mãi</h1>
                        <p className="text-xs text-white/60 font-medium">Cấu hình mã giảm giá theo loại hình và thời gian.</p>
                    </div>

                    <button
                        onClick={handleOpenCreate}
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg flex items-center gap-2 transition-all active:scale-95 backdrop-blur-md"
                    >
                        <Plus size={18} className="text-emerald-400" />
                        Tạo khuyến mãi
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-lg flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shadow-inner">
                                <CheckCircle2 size={28} />
                            </div>
                            <div>
                                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Đang chạy</p>
                                <p className="text-3xl font-black text-white">{uiPromotions.filter(p => p.status === 'active').length}</p>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-lg flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center shadow-inner">
                                <Clock size={28} />
                            </div>
                            <div>
                                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Sắp diễn ra</p>
                                <p className="text-3xl font-black text-white">{uiPromotions.filter(p => p.status === 'upcoming').length}</p>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-lg flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shadow-inner">
                                <Ticket size={28} />
                            </div>
                            <div>
                                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Tổng chương trình</p>
                                <p className="text-3xl font-black text-white">{uiPromotions.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
                        {/* Toolbar */}
                        <div className="p-6 border-b border-white/5 flex flex-col lg:row justify-between items-center gap-6">
                            <div className="flex bg-black/20 p-1.5 rounded-2xl w-full lg:w-auto border border-white/5">
                                {[
                                    { id: 'all', label: 'Tất cả' },
                                    { id: 'active', label: 'Đang chạy' },
                                    { id: 'upcoming', label: 'Sắp tới' },
                                    { id: 'expired', label: 'Kết thúc' }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as TabType)}
                                        className={`flex-1 lg:flex-none px-6 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wide ${activeTab === tab.id
                                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40'
                                            : 'text-white/50 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            <div className="relative w-full lg:w-80 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-rose-400 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm mã hoặc tên..."
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-black/20 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-rose-500/50 focus:bg-black/40 transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#0f172a]/80 text-white/50 text-[10px] uppercase font-black tracking-[0.15em] border-b border-white/10 backdrop-blur-md">
                                    <tr>
                                        <th className="px-8 py-5">Thông tin khuyến mãi</th>
                                        <th className="px-6 py-5 text-center">Mã Code</th>
                                        <th className="px-6 py-5 text-center">Giá trị giảm</th>
                                        <th className="px-6 py-5">Thời gian áp dụng</th>
                                        <th className="px-6 py-5 text-center">Trạng thái</th>
                                        <th className="px-8 py-5 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr><td colSpan={6} className="py-20 text-center font-bold text-white/30 animate-pulse">Đang tải dữ liệu...</td></tr>
                                    ) : currentItems.length > 0 ? (
                                        currentItems.map((promo) => (
                                            <tr key={promo.id} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-lg border border-white/10 flex-shrink-0 bg-white/5">
                                                            {promo.banner_url ? (
                                                                <Image src={promo.banner_url} alt={promo.name} fill className="object-cover" sizes="56px" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-white/20"><Ticket size={24} /></div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-white text-sm truncate">{promo.name}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${promo.target_type === 'all' ? 'bg-blue-500/20 text-blue-300' : 'bg-amber-500/20 text-amber-300'}`}>
                                                                    {promo.target_type === 'all' ? 'Public' : 'VIP Only'}
                                                                </span>
                                                                <span className="text-[10px] text-white/40 font-medium">{promo.usageCount} lượt dùng</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className="bg-black/40 text-white border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono font-black tracking-widest shadow-inner">
                                                        {promo.code}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className="text-sm font-black text-rose-400">
                                                        {promo.discount_type === 'percent'
                                                            ? `${promo.discount_value}%`
                                                            : formatCurrency(promo.discount_value)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-0.5">
                                                        <div className="flex items-center gap-1.5 text-xs font-bold text-white/80">
                                                            <Calendar size={12} className="text-white/40" />
                                                            {new Date(promo.end_date).toLocaleDateString('vi-VN')}
                                                        </div>
                                                        <p className="text-[9px] text-white/40 font-medium">Bắt đầu: {new Date(promo.start_date).toLocaleDateString('vi-VN')}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <StatusBadge status={promo.status} />
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-all">
                                                        <button onClick={() => handleOpenEdit(promo)} className="p-2 text-blue-300 hover:bg-white/10 rounded-xl transition-colors"><Edit size={16} /></button>
                                                        <button className="p-2 text-rose-400 hover:bg-white/10 rounded-xl transition-colors"><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={6} className="py-24 text-center text-white/30 font-bold italic">Không có chương trình nào phù hợp.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredPromotions.length > 0 && (
                            <div className="px-8 py-5 border-t border-white/5 bg-black/20 flex justify-between items-center">
                                <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
                                    Trang {currentPage} / {totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all shadow-sm text-white"><ChevronLeft size={18} /></button>
                                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all shadow-sm text-white"><ChevronRight size={18} /></button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* CRUD Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                        <div className="bg-[#1e293b] rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/10">
                            <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h3 className="font-black text-xl text-white tracking-tight">
                                    {formData.id ? 'Hiệu chỉnh khuyến mãi' : 'Tạo chiến dịch mới'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSave} className="p-8 space-y-5">
                                {/* Tên & Code */}
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-2 ml-1">Tên chương trình</label>
                                        <input type="text" required className="w-full px-5 py-3 rounded-2xl bg-black/30 border border-white/10 text-white focus:ring-1 focus:ring-rose-500/50 outline-none transition-all font-bold text-sm" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-2 ml-1">Mã Code (Voucher)</label>
                                        <input type="text" required className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white outline-none font-mono font-black tracking-widest uppercase focus:border-rose-500/50 transition-all text-sm" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} />
                                    </div>
                                </div>

                                {/* Giá trị giảm */}
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-2 ml-1">Loại giảm giá</label>
                                        <div className="flex bg-black/20 p-1 rounded-xl">
                                            <button type="button" onClick={() => setFormData({ ...formData, discount_type: 'percent' })} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${formData.discount_type === 'percent' ? 'bg-rose-500 text-white shadow-md' : 'text-white/40'}`}>%</button>
                                            <button type="button" onClick={() => setFormData({ ...formData, discount_type: 'fixed' })} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${formData.discount_type === 'fixed' ? 'bg-rose-500 text-white shadow-md' : 'text-white/40'}`}>VNĐ</button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-2 ml-1">Giá trị</label>
                                        <div className="relative">
                                            <input type="number" required className="w-full pl-4 pr-8 py-2.5 rounded-xl bg-black/30 border border-white/10 outline-none font-black text-rose-400 text-sm" value={formData.discount_value} onChange={e => setFormData({ ...formData, discount_value: Number(e.target.value) })} />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
                                                {formData.discount_type === 'percent' ? <Percent size={14} /> : <span className="text-[10px] font-bold">đ</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Thời gian */}
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-2 ml-1">Bắt đầu</label>
                                        <input type="datetime-local" required className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-xs font-bold outline-none focus:border-rose-500/50" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-white/50 uppercase tracking-widest mb-2 ml-1">Kết thúc</label>
                                        <input type="datetime-local" required className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-xs font-bold outline-none focus:border-rose-500/50" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} />
                                    </div>
                                </div>

                                <div className="pt-2 flex gap-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl text-xs font-black text-white/40 uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all">Đóng</button>
                                    <button type="submit" disabled={isSubmitting} className="flex-1 py-4 rounded-2xl bg-rose-600 text-white text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-rose-600/20 hover:bg-rose-500 transition-all flex justify-center items-center gap-2">
                                        {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={16} /> Lưu cấu hình</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
                input[type="datetime-local"]::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; opacity: 0.6; }
            `}</style>
        </div>
    );
}