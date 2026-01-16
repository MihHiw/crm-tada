'use client';

import GlobalBackground from '@/components/GlobalBackground';
import { Sidebar } from "@/components/admin/Sidebar";
import { useTransactions } from '@/hooks/transactions/useTransactions';
import {
    ArrowDownLeft,
    ArrowUpRight,
    Calendar,
    CreditCard, // ✅ Sử dụng cho thanh toán dịch vụ
    Filter,
    Search,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

// --- HELPER FUNCTIONS ---
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
};

// --- COMPONENTS ---
const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 ring-emerald-500/20',
        pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20 ring-amber-500/20',
        failed: 'bg-red-500/10 text-red-400 border-red-500/20 ring-red-500/20',
    };

    const labels: Record<string, string> = {
        success: 'Thành công',
        pending: 'Đang xử lý',
        failed: 'Thất bại',
    };

    return (
        <span className={`px-2.5 py-1 inline-flex items-center text-[11px] font-bold uppercase tracking-wide rounded-full border ring-1 backdrop-blur-md ${styles[status] || 'bg-slate-500/10 text-slate-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'success' ? 'bg-emerald-400' : status === 'pending' ? 'bg-amber-400' : 'bg-red-400'}`}></span>
            {labels[status] || status}
        </span>
    );
};

const TransactionIcon = ({ type }: { type: string }) => {
    // 1. Nạp tiền
    if (type === 'deposit') {
        return (
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                <ArrowDownLeft size={16} />
            </div>
        );
    }
    // 2. Thanh toán dịch vụ (Đã đổi icon mới)
    if (type === 'payment') {
        return (
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.1)]">
                <CreditCard size={16} />
            </div>
        );
    }
    // 3. Rút tiền
    return (
        <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.1)]">
            <ArrowUpRight size={16} />
        </div>
    );
};

// --- MAIN PAGE ---
export default function TransactionsPage() {
    const { transactions, loading, error } = useTransactions();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTransactions = transactions.filter(tx =>
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.user_name && tx.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        tx.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex h-screen w-full items-center justify-center bg-[#020617] text-slate-300">
            <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
                <p className="text-sm font-medium animate-pulse">Đang đồng bộ dữ liệu...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex h-screen w-full items-center justify-center bg-[#020617]">
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center max-w-md backdrop-blur-md">
                <p className="text-red-400 font-bold mb-2">Đã xảy ra lỗi</p>
                <p className="text-slate-400 text-sm">{error}</p>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen font-sans text-slate-200">
            <GlobalBackground />
            <Sidebar />

            <div className="flex-1 lg:ml-64 transition-all duration-300 relative z-10">
                <main className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-4">

                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Lịch sử giao dịch</h1>
                            <p className="text-white/60 text-sm font-medium">
                                Quản lý dòng tiền, nạp rút và thanh toán dịch vụ.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <div className="px-4 py-2 bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-xl flex items-center gap-2 shadow-sm">
                                <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Tổng giao dịch</span>
                                <span className="text-white font-bold">{transactions.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Toolbar: Search & Filter */}
                    <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex flex-wrap gap-4 items-center justify-between shadow-lg">
                        <div className="relative flex-1 min-w-[300px] max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Tìm tên, mã GD hoặc nội dung..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-white/5 rounded-xl outline-none focus:border-indigo-500/50 focus:bg-slate-900/80 transition-all text-sm text-white placeholder:text-slate-500 shadow-inner"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-xl transition-all text-sm font-semibold shadow-sm">
                            <Filter size={16} />
                            Bộ lọc nâng cao
                        </button>
                    </div>

                    {/* Table Container */}
                    <div className="bg-slate-800/20 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white/5 border-b border-white/10">
                                    <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                        <th className="px-8 py-5">Khách hàng</th>
                                        <th className="px-6 py-5">Loại & Nội dung</th>
                                        <th className="px-6 py-5 text-right">Số tiền</th>
                                        <th className="px-6 py-5 text-center">Trạng thái</th>
                                        <th className="px-8 py-5 text-right">Thời gian</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-white/5">
                                    {filteredTransactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-white/5 transition-all duration-200 group">
                                            {/* Khách hàng */}
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative w-10 h-10 flex-shrink-0">
                                                        {tx.user_avatar ? (
                                                            <Image
                                                                src={tx.user_avatar}
                                                                alt={tx.user_name || 'User'}
                                                                fill
                                                                className="rounded-full object-cover ring-2 ring-white/10 group-hover:ring-indigo-500/30 transition-all"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full rounded-full bg-indigo-500/10 text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-500/20 ring-2 ring-white/5 group-hover:bg-indigo-500/20 transition-all">
                                                                {getInitials(tx.user_name || tx.user_id)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                                                            {tx.user_name || "Khách vãng lai"}
                                                        </div>
                                                        <div className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">
                                                            ID: {tx.user_id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Loại GD */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <TransactionIcon type={tx.type} />
                                                    <div className="flex flex-col">
                                                        <div className="font-bold text-slate-200 text-xs">
                                                            {tx.type === 'deposit' ? 'Nạp tiền vào ví' : tx.type === 'payment' ? 'Thanh toán dịch vụ' : 'Rút tiền'}
                                                        </div>
                                                        <div className="text-[11px] text-slate-500 mt-1 line-clamp-1 max-w-[200px]" title={tx.description}>
                                                            {tx.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Số tiền */}
                                            <td className="px-6 py-5 text-right">
                                                <div className={`text-sm font-black tracking-tight ${tx.amount > 0 ? 'text-emerald-400' : 'text-slate-100'}`}>
                                                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                                                </div>
                                            </td>

                                            {/* Trạng thái */}
                                            <td className="px-6 py-5 text-center">
                                                <StatusBadge status={tx.status} />
                                            </td>

                                            {/* Thời gian */}
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-slate-200 font-bold text-xs tracking-tight">
                                                        {new Date(tx.created_at).toLocaleDateString('vi-VN')}
                                                    </span>
                                                    <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5 mt-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                                        <Calendar size={10} className="text-indigo-400/70" />
                                                        {new Date(tx.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredTransactions.length === 0 && (
                                <div className="py-24 text-center bg-slate-900/20">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
                                        <Search size={32} className="text-slate-600" />
                                    </div>
                                    <p className="text-slate-400 font-medium">Không tìm thấy dữ liệu giao dịch phù hợp.</p>
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="mt-4 text-indigo-400 text-xs font-bold hover:text-indigo-300 transition-colors uppercase tracking-widest"
                                    >
                                        Xóa bộ lọc
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}