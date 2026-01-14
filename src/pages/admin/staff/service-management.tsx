"use client";

import { Sidebar } from '@/components/admin/Sidebar';
import { ServiceUI, useServicesData } from '@/hooks/servicespa/useServicesData';
import {
    Clock,
    Edit3,
    Image as ImageIcon,
    Plus,
    Search,
    Trash2,
    X
} from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

export default function ServiceManagement() {
    // 1. Lấy dữ liệu từ Hook mới
    const { services: dataFromApi, categories, isLoading, filterServices, selectedCategory } = useServicesData();

    const [localServices, setLocalServices] = useState<ServiceUI[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage: number = 8;

    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<ServiceUI>>({
        name: '',
        categoryId: '',
        price: 0,
        durationMin: 30,
        description: '',
        imageUrl: '',
    });

    // Cập nhật local state khi data từ hook thay đổi
    useEffect(() => {
        if (dataFromApi) setLocalServices(dataFromApi);
    }, [dataFromApi]);

    // --- Logic Filter theo SearchTerm (Category đã được hook xử lý) ---
    const displayedServices = useMemo(() => {
        return localServices.filter((s) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [localServices, searchTerm]);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCategory]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = displayedServices.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(displayedServices.length / itemsPerPage);

    const handleAddNew = (): void => {
        setEditingId(null);
        setFormData({
            name: '',
            price: 0,
            durationMin: 30,
            categoryId: categories[0]?.id || '',
            description: '',
            imageUrl: '',
        });
        setIsModalOpen(true);
    };

    const handleEdit = (service: ServiceUI): void => {
        setEditingId(service.id);
        setFormData({ ...service });
        setIsModalOpen(true);
    };

    const handleDelete = (id: string): void => {
        if (confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
            setLocalServices(prev => prev.filter(s => s.id !== id));
        }
    };

    const handleSave = (): void => {
        if (!formData.name || formData.price === undefined) {
            alert("Vui lòng nhập thông tin bắt buộc");
            return;
        }
        if (editingId) {
            setLocalServices(prev => prev.map(s => s.id === editingId ? { ...s, ...formData } as ServiceUI : s));
        } else {
            const newId = `srv-${Math.random().toString(36).substr(2, 4)}`;
            setLocalServices(prev => [{ ...(formData as ServiceUI), id: newId, _id: newId }, ...prev]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="flex h-screen bg-[#F4F7FE] overflow-hidden font-sans">
            <Head><title>Dịch vụ & Sản phẩm | Quản trị CRM</title></Head>

            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all">
                {/* Header Section */}
                <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-bold text-slate-800">Danh mục Dịch vụ</h1>
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] rounded-full font-bold border border-emerald-100 uppercase tracking-wider">
                            {displayedServices.length} mục
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Tìm theo tên dịch vụ..."
                                className="h-9 w-64 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleAddNew}
                            className="h-9 px-4 bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all active:scale-95 shadow-md shadow-emerald-100"
                        >
                            <Plus size={16} /> Thêm mới
                        </button>
                    </div>
                </header>

                {/* Dynamic Filter Tabs */}
                <div className="px-8 py-3 bg-white border-b border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => filterServices('all')}
                        className={`px-5 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap border ${selectedCategory === 'all' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-500 border-slate-200 hover:text-emerald-500'}`}
                    >
                        Tất cả
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => filterServices(cat.id)}
                            className={`px-5 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap border ${selectedCategory == cat.id ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-500 border-slate-200 hover:text-emerald-500'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full text-slate-400 animate-pulse font-bold tracking-widest uppercase text-xs">Đang đồng bộ dữ liệu Spa...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {currentItems.map((service) => (
                                <div key={service.id} className="bg-white border border-slate-200 rounded-[2rem] p-4 hover:shadow-2xl hover:border-emerald-100 transition-all group flex flex-col h-full relative overflow-hidden">
                                    <div className="relative h-40 w-full bg-slate-100 rounded-[1.5rem] mb-4 overflow-hidden border border-slate-50">
                                        <Image
                                            src={service.imageUrl || 'https://placehold.co/400x300?text=Service'}
                                            alt={service.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            sizes="300px"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[9px] font-black uppercase rounded-full border border-slate-100 text-emerald-600 shadow-sm">
                                                {service.categoryName}
                                            </span>
                                        </div>
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <button onClick={() => handleEdit(service)} className="p-3 bg-white rounded-2xl text-blue-500 hover:scale-110 transition-transform shadow-xl"><Edit3 size={16} /></button>
                                            <button onClick={() => handleDelete(service.id)} className="p-3 bg-white rounded-2xl text-rose-500 hover:scale-110 transition-transform shadow-xl"><Trash2 size={16} /></button>
                                        </div>
                                    </div>

                                    <div className="flex-1 px-1">
                                        <h3 className="text-sm font-black text-slate-800 line-clamp-2 mb-2 min-h-[40px] uppercase tracking-tight leading-tight">{service.name}</h3>
                                        <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed mb-4 italic font-medium">
                                            {service.description || "Liệu trình chăm sóc da chuyên sâu tại Vanilla Spa."}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Giá dịch vụ</span>
                                            <span className="text-sm font-black text-emerald-600 tracking-tighter">{service.price.toLocaleString()}đ</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                            <Clock size={12} className="text-emerald-500" />
                                            <span className="text-[10px] font-black uppercase tracking-tighter">{service.durationMin}p</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <footer className="h-16 bg-white border-t border-slate-200 px-8 flex items-center justify-between shadow-sm z-10">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trang {currentPage} / {totalPages || 1}</div>
                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded-xl font-black text-[10px] transition-all shadow-sm ${currentPage === page ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 hover:bg-emerald-50 border border-slate-100'}`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </footer>
            </main>

            {/* Form Drawer */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-[480px] bg-white h-full shadow-2xl flex flex-col animate-slideLeft">
                        <div className="h-20 border-b border-slate-100 px-8 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h2 className="font-black text-slate-800 text-sm uppercase tracking-widest">{editingId ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới'}</h2>
                                <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Hệ thống quản lý dịch vụ Vanilla Spa</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2.5 bg-white rounded-2xl text-slate-400 hover:text-rose-500 shadow-sm border border-slate-100 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            {/* Image Input */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Banner Hình ảnh (URL)</label>
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="Nhập đường dẫn ảnh..."
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        className="flex-1 h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500/20 focus:bg-white transition-all"
                                    />
                                    <div className="w-12 h-12 relative bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200 shrink-0 shadow-inner">
                                        {formData.imageUrl ? <Image src={formData.imageUrl} alt="Preview" fill className="object-cover" /> : <div className="flex items-center justify-center h-full"><ImageIcon size={18} className="text-slate-300" /></div>}
                                    </div>
                                </div>
                            </div>

                            {/* Service Name */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Tên dịch vụ <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Tên liệu trình làm đẹp..."
                                    className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-bold outline-none focus:border-emerald-500/20 focus:bg-white transition-all"
                                />
                            </div>

                            {/* Category & Duration */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Danh mục</label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-bold outline-none cursor-pointer focus:border-emerald-500"
                                    >
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Thời lượng (p)</label>
                                    <input
                                        type="number"
                                        value={formData.durationMin}
                                        onChange={(e) => setFormData({ ...formData, durationMin: Number(e.target.value) })}
                                        className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-bold outline-none"
                                    />
                                </div>
                            </div>

                            {/* Price */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Giá niêm yết (VND)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                    className="w-full h-14 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg font-black text-emerald-600 outline-none focus:bg-white focus:border-emerald-500/20 transition-all shadow-inner"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Mô tả liệu trình</label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Nội dung công dụng dịch vụ..."
                                    className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl text-xs font-bold leading-relaxed outline-none focus:bg-white focus:border-emerald-500/20 transition-all resize-none shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="h-24 p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
                            <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-all active:scale-95 shadow-sm">Hủy bỏ</button>
                            <button onClick={handleSave} className="flex-[2] bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all active:scale-95">Lưu thay đổi</button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .animate-slideLeft { animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}