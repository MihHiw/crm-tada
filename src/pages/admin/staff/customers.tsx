"use client";

import { Award, ChevronLeft, ChevronRight, Mail, Phone, Plus, Save, Search, User, X } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

// Hooks & Components
import CustomerRow from '@/components/admin/customer/CustomerRow';
import CustomerStats from '@/components/admin/customer/CustomerStats';
import CustomerToolbar from '@/components/admin/customer/CustomerToolbar';
import { Sidebar } from '@/components/admin/Sidebar';
import GlobalBackground from '@/components/GlobalBackground';
// Import type từ Hook
import { NewCustomerInput, useCustomerManagement } from '@/hooks/customerManagement/useCustomerManagement';

export default function CustomerManagement() {
    const router = useRouter();
    const { state, setters, actions } = useCustomerManagement();
    const { paginatedCustomers, searchTerm, filterTier, currentPage, totalPages, customers } = state;

    // --- MODAL STATE ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Sử dụng interface NewCustomerInput để đảm bảo đúng key
    const [formData, setFormData] = useState<NewCustomerInput>({
        full_name: '',
        phone: '',
        email: '',
        tier: 'Thành viên'
    });

    const handleNavigateDetail = (id: string | number) => {
        router.push(`/admin/customerAdmin/${id}`);
    };

    const handleCreateCustomer = (e: React.FormEvent) => {
        e.preventDefault();
        actions.addCustomer(formData);
        setIsAddModalOpen(false);
        setFormData({ full_name: '', phone: '', email: '', tier: 'Thành viên' });
    };

    return (
        <div className="flex h-screen w-full overflow-hidden font-sans text-white">
            <GlobalBackground />

            {/* Sidebar */}
            <div className="w-[260px] flex-shrink-0 h-full border-r border-white/10 bg-slate-900/60 backdrop-blur-xl z-20">
                <Sidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 h-full overflow-y-auto relative z-10 scrollbar-hide">
                <div className="w-full max-w-[1600px] mx-auto p-6 md:p-10 flex flex-col h-full space-y-8">

                    {/* HEADER */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Quản lý khách hàng</h1>
                            <p className="text-white/60 text-sm font-medium">Quản lý hạng thành viên và lịch sử giao dịch.</p>
                        </div>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-emerald-500/30 transition-all backdrop-blur-md"
                        >
                            <Plus size={18} />
                            Thêm khách mới
                        </button>
                    </div>

                    {/* STATS */}
                    <CustomerStats customers={customers} />

                    {/* TABLE AREA */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/10 flex flex-col overflow-hidden flex-1 min-h-[500px]">

                        {/* Toolbar */}
                        <div className="p-6 border-b border-white/5">
                            <CustomerToolbar
                                filterTier={filterTier}
                                setFilterTier={(tier) => { setters.setFilterTier(tier); setters.setCurrentPage(1); }}
                                searchTerm={searchTerm}
                                setSearchTerm={(term) => { setters.setSearchTerm(term); setters.setCurrentPage(1); }}
                            />
                        </div>

                        {/* Table */}
                        <div className="overflow-auto w-full flex-1 custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 z-10 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10">
                                    <tr className="text-white/60 text-[10px] uppercase tracking-widest">
                                        <th className="px-8 py-5 font-bold whitespace-nowrap">Thông tin khách hàng</th>
                                        <th className="px-6 py-5 font-bold whitespace-nowrap text-center">Hạng</th>
                                        <th className="px-6 py-5 font-bold whitespace-nowrap">Số dư ví</th>
                                        <th className="px-6 py-5 font-bold whitespace-nowrap">Tổng chi tiêu</th>
                                        <th className="px-6 py-5 font-bold whitespace-nowrap">Lần cuối ghé</th>
                                        <th className="px-6 py-5 font-bold text-right whitespace-nowrap">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {paginatedCustomers.length > 0 ? (
                                        paginatedCustomers.map((customer) => (
                                            <CustomerRow
                                                key={customer.id}
                                                customer={customer}
                                                onRowClick={handleNavigateDetail}
                                                onFormatCurrency={actions.formatCurrency}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center justify-center text-white/40 gap-3">
                                                    <div className="p-4 bg-white/5 rounded-full border border-white/10">
                                                        <Search size={32} />
                                                    </div>
                                                    <p className="font-bold text-white/60">Không tìm thấy khách hàng nào</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-8 py-4 bg-black/20 border-t border-white/5 flex items-center justify-between text-white">
                            <p className="text-xs text-white/50 font-medium">
                                Trang <span className="font-bold text-white">{currentPage}</span> / {totalPages || 1}
                            </p>
                            <div className="flex items-center gap-2">
                                <button onClick={() => actions.goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all text-white"><ChevronLeft size={16} /></button>
                                <button onClick={() => actions.goToPage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-all text-white"><ChevronRight size={16} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* MODAL */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h3 className="text-xl font-bold text-white">Thêm khách hàng mới</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-white/50 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateCustomer} className="p-6 space-y-5">
                            {/* Input Họ tên */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/60 uppercase">Họ và tên <span className="text-red-400">*</span></label>
                                <div className="relative group">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                                        placeholder="Nhập tên khách hàng..."
                                        value={formData.full_name} // Đã sửa thành full_name
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Input Phone */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/60 uppercase">Số điện thoại <span className="text-red-400">*</span></label>
                                    <div className="relative group">
                                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-400" size={18} />
                                        <input
                                            type="tel"
                                            required
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                                            placeholder="090..."
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Input Email */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/60 uppercase">Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-400" size={18} />
                                        <input
                                            type="email"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                                            placeholder="example@mail.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Select Hạng */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/60 uppercase">Hạng thành viên</label>
                                <div className="relative group">
                                    <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-400" size={18} />
                                    <select
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"
                                        value={formData.tier}
                                        onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                                    >
                                        <option value="Thành viên" className="bg-slate-900">Thành viên</option>
                                        <option value="Silver" className="bg-slate-900">Bạc</option>
                                        <option value="Gold" className="bg-slate-900">Vàng</option>
                                        <option value="Diamond" className="bg-slate-900">Kim cương</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <ChevronLeft className="rotate-[-90deg] text-white/30" size={14} />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3 border-t border-white/5 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl border border-white/10 text-white/70 text-sm font-bold hover:bg-white/5"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    Lưu khách hàng
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}