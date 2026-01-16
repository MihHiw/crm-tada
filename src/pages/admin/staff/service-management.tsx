"use client";

import { Sidebar } from '@/components/admin/Sidebar';
import GlobalBackground from '@/components/GlobalBackground';
import { ServiceUI, useServicesData } from '@/hooks/servicespa/useServicesData';

import {
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

    useEffect(() => {
        if (dataFromApi) setLocalServices(dataFromApi);
    }, [dataFromApi]);

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
        // ROOT: Dark Mode + Glass
        <div className="flex h-screen overflow-hidden font-sans text-white">
            <GlobalBackground />
            <Head><title>Dịch vụ & Sản phẩm | Quản trị CRM</title></Head>

            {/* Sidebar Glass */}
            <div className="w-[260px] flex-shrink-0 h-full border-r border-white/10 bg-slate-900/60 backdrop-blur-xl z-20">
                <Sidebar />
            </div>

            <main className="flex-1 flex flex-col min-w-0 transition-all relative z-10 scrollbar-hide">

                {/* Header Section (Transparent) */}
                <header className="h-20 bg-transparent border-b border-white/10 px-8 flex items-center justify-between z-10 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-white tracking-tight">Danh mục Dịch vụ</h1>
                        <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] rounded-full font-bold border border-emerald-500/30 uppercase tracking-wider">
                            {displayedServices.length} mục
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-400 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Tìm theo tên dịch vụ..."
                                className="h-10 w-64 pl-10 pr-4 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 outline-none focus:border-emerald-500/50 focus:bg-black/40 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleAddNew}
                            className="h-10 px-5 bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                        >
                            <Plus size={16} /> Thêm mới
                        </button>
                    </div>
                </header>

                {/* Filter Tabs (Glass) */}
                <div className="px-8 py-4 bg-black/20 border-b border-white/5 flex gap-2 overflow-x-auto no-scrollbar backdrop-blur-md">
                    <button
                        onClick={() => filterServices('all')}
                        className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all whitespace-nowrap border ${selectedCategory === 'all'
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30'
                            : 'bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10'}`}
                    >
                        Tất cả
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => filterServices(cat.id)}
                            className={`px-5 py-2 rounded-full text-[11px] font-bold transition-all whitespace-nowrap border ${selectedCategory == cat.id
                                ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30'
                                : 'bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full text-white/40 animate-pulse font-bold tracking-widest uppercase text-xs">Đang đồng bộ dữ liệu Spa...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {currentItems.map((service) => (
                                <div key={service.id} className="bg-white/5 border border-white/10 rounded-[2rem] p-4 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] transition-all duration-300 group flex flex-col h-full relative overflow-hidden backdrop-blur-md shadow-lg">

                                    {/* Image Wrapper */}
                                    <div className="relative h-48 w-full bg-black/30 rounded-[1.5rem] mb-4 overflow-hidden border border-white/5">
                                        <Image
                                            src={service.imageUrl || 'https://placehold.co/400x300/1e293b/ffffff?text=Service'}
                                            alt={service.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />

                                        {/* Category Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-[9px] font-black uppercase rounded-full border border-white/10 text-white shadow-sm">
                                                {service.categoryName}
                                            </span>
                                        </div>

                                        {/* Action Buttons (Hidden) */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                                            <button onClick={() => handleEdit(service)} className="p-3 bg-white text-slate-900 rounded-2xl hover:scale-110 transition-transform shadow-xl"><Edit3 size={18} /></button>
                                            <button onClick={() => handleDelete(service.id)} className="p-3 bg-rose-500 text-white rounded-2xl hover:scale-110 transition-transform shadow-xl"><Trash2 size={18} /></button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 px-1">
                                        <h3 className="text-sm font-black text-white line-clamp-2 mb-2 min-h-[40px] uppercase tracking-tight leading-snug group-hover:text-emerald-300 transition-colors">
                                            {service.name}
                                        </h3>
                                        <p className="text-[10px] text-white/50 line-clamp-2 leading-relaxed mb-4 font-medium">
                                            {service.description || "Liệu trình chăm sóc da chuyên sâu tại Vanilla Spa."}
                                        </p>
                                    </div>

                                    {/* Footer Price & Duration */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-0.5">Giá dịch vụ</span>
                                            <span className="text-lg font-black text-emerald-400 tracking-tight">{service.price.toLocaleString()}đ</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination (Glass Footer) */}
                <footer className="h-16 bg-black/20 border-t border-white/5 px-8 flex items-center justify-between z-10 backdrop-blur-md">
                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Trang {currentPage} / {totalPages || 1}</div>
                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded-xl font-bold text-[10px] transition-all shadow-sm ${currentPage === page
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'}`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </footer>
            </main>

            {/* Form Drawer (Dark Glass Modal) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-[480px] bg-[#1e293b] h-full shadow-2xl flex flex-col animate-slideLeft border-l border-white/10">
                        <div className="h-20 border-b border-white/10 px-8 flex items-center justify-between bg-white/5">
                            <div>
                                <h2 className="font-black text-white text-sm uppercase tracking-widest">{editingId ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới'}</h2>
                                <p className="text-[9px] text-white/40 font-bold uppercase mt-1">Hệ thống quản lý dịch vụ Vanilla Spa</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2.5 bg-white/5 rounded-2xl text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            {/* Image Input */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Banner Hình ảnh (URL)</label>
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="Nhập đường dẫn ảnh..."
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        className="flex-1 h-12 px-4 bg-black/30 border border-white/10 rounded-2xl text-xs font-bold text-white outline-none focus:border-emerald-500/50 transition-all placeholder-white/20"
                                    />
                                    <div className="w-12 h-12 relative bg-black/30 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                                        {formData.imageUrl ? <Image src={formData.imageUrl} alt="Preview" fill className="object-cover" /> : <div className="flex items-center justify-center h-full"><ImageIcon size={18} className="text-white/20" /></div>}
                                    </div>
                                </div>
                            </div>

                            {/* Service Name */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Tên dịch vụ <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Tên liệu trình làm đẹp..."
                                    className="w-full h-12 px-4 bg-black/30 border border-white/10 rounded-2xl text-xs font-bold text-white outline-none focus:border-emerald-500/50 transition-all placeholder-white/20"
                                />
                            </div>

                            {/* Category & Duration */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Danh mục</label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        className="w-full h-12 px-4 bg-black/30 border border-white/10 rounded-2xl text-xs font-bold text-white outline-none cursor-pointer focus:border-emerald-500/50 appearance-none"
                                    >
                                        {categories.map(c => <option key={c.id} value={c.id} className="bg-slate-800 text-white">{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Thời lượng (p)</label>
                                    <input
                                        type="number"
                                        value={formData.durationMin}
                                        onChange={(e) => setFormData({ ...formData, durationMin: Number(e.target.value) })}
                                        className="w-full h-12 px-4 bg-black/30 border border-white/10 rounded-2xl text-xs font-bold text-white outline-none focus:border-emerald-500/50"
                                    />
                                </div>
                            </div>

                            {/* Price */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Giá niêm yết (VND)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                    className="w-full h-14 px-6 bg-black/30 border border-white/10 rounded-2xl text-lg font-black text-emerald-400 outline-none focus:border-emerald-500/50 transition-all"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Mô tả liệu trình</label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Nội dung công dụng dịch vụ..."
                                    className="w-full p-5 bg-black/30 border border-white/10 rounded-3xl text-xs font-bold text-white leading-relaxed outline-none focus:border-emerald-500/50 transition-all resize-none placeholder-white/20"
                                />
                            </div>
                        </div>

                        <div className="h-24 p-6 bg-black/20 border-t border-white/10 flex gap-4 backdrop-blur-md">
                            <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-white/10 hover:text-white transition-all active:scale-95">Hủy bỏ</button>
                            <button onClick={handleSave} className="flex-[2] bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition-all active:scale-95">Lưu thay đổi</button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .animate-slideLeft { animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}