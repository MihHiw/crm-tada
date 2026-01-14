"use client";
import CreateLoanModal from '@/components/admin/Modal/CreateLoanModal';
import Sidebar from '@/components/admin/Sidebar';
import { useCustomers } from '@/hooks/customer/useCustomers';
import { 
    Bell, Calendar, FileText, History, Landmark, 
    MoreHorizontal, Plus, Search, Timer, Loader2,
    ChevronLeft, ChevronRight 
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';

export default function CustomerPage() {
    const router = useRouter();
    const { customers, loading, searchTerm, setSearchTerm } = useCustomers();
    const [hoveredLoanId, setHoveredLoanId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- LOGIC PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; 

    // Tính toán dữ liệu hiển thị (Dùng useMemo để tối ưu hiệu năng)
    const { paginatedCustomers, totalPages } = useMemo(() => {
        const total = Math.ceil(customers.length / itemsPerPage);
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return {
            paginatedCustomers: customers.slice(start, end),
            totalPages: total
        };
    }, [customers, currentPage]);

    // --- XỬ LÝ QUYỀN TRUY CẬP ---
    const [admin] = useState<any>(() => {
        if (typeof window !== 'undefined') {
            const session = localStorage.getItem('user_session');
            return session ? JSON.parse(session) : null;
        }
        return null;
    });

    useEffect(() => {
        if (!admin) {
            router.push('/login');
        } else if (admin.role !== 'admin') {
            alert("Bạn không có quyền truy cập trang này!");
            router.push('/user');
        }
    }, [admin, router]);

    // --- LOGIC THỐNG KÊ ---
    const loanStats = useMemo(() => {
        return [
            { label: 'Đang chờ duyệt', count: customers.filter(c => c.status !== 'Active').length },
            { label: 'Đã giải ngân', count: customers.filter(c => c.status === 'Active').length },
            { label: 'Tổng lượt vay', count: customers.reduce((acc, c) => acc + (c.loanCount || 0), 0) },
            { label: 'Hồ sơ mới', count: customers.filter(c => (c.loanCount || 0) === 0).length }
        ];
    }, [customers]);

    const handleCreateCustomer = (newData: any) => {
        alert(`Đã khởi tạo hồ sơ cho: ${newData.name}`);
        setIsModalOpen(false);
    };

    if (!admin || admin.role !== 'admin') return null;

    return (
        <div className="flex min-h-screen bg-[#0B0F1A]">
            <Sidebar adminName={admin.name} />

            <main className="flex-1 overflow-y-auto">
                {/* Search Bar & Header */}
                <div className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-[#0B0F1A]/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // FIX: Reset trang trực tiếp tại đây để tránh lỗi useEffect cascading
                            }}
                            placeholder="Tìm mã hồ sơ, tên, số điện thoại..."
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-1.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                        <div className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20">
                            <Landmark size={14} /> Lãi suất ưu đãi: 8.5%
                        </div>
                        <button className="hover:text-white p-2 transition-colors"><Bell size={20} /></button>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">Hồ sơ Vay Tín dụng</h1>
                            <p className="text-gray-400 text-sm">Quản lý khoản vay và lịch sử tín dụng khách hàng.</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95 text-sm"
                        >
                            <Plus size={18} /> Tạo hồ sơ vay mới
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {loanStats.map((stat, idx) => (
                            <div key={idx} className="bg-[#161D2F] p-4 rounded-2xl border border-gray-800 shadow-sm">
                                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">{stat.label}</p>
                                <p className="text-2xl font-bold text-white mt-1">{stat.count}</p>
                            </div>
                        ))}
                    </div>

                    {/* Table Container */}
                    <div className="bg-[#161D2F] rounded-2xl border border-gray-800 shadow-2xl relative">
                        {loading && (
                            <div className="absolute inset-0 bg-[#161D2F]/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                                <Loader2 className="animate-spin text-emerald-500" size={32} />
                            </div>
                        )}

                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#1F2937]/50 text-gray-400 text-[10px] uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-5">Khách hàng</th>
                                    <th className="px-6 py-5">Mã hợp đồng / Ngày tạo</th>
                                    <th className="px-6 py-5">Số tiền / Chi tiết lần vay</th>
                                    <th className="px-6 py-5 text-center">Trạng thái hồ sơ</th>
                                    <th className="px-6 py-5 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {paginatedCustomers.length > 0 ? (
                                    paginatedCustomers.map((c) => (
                                        <tr
                                            key={c.id}
                                            onClick={() => router.push(`/admin/customers/${c.id}`)}
                                            className="hover:bg-emerald-500/5 transition-all cursor-pointer group"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-11 h-11 flex-shrink-0">
                                                        <Image
                                                            src={c.avatar || '/default-avatar.png'}
                                                            alt="" fill className="rounded-full object-cover ring-2 ring-gray-800 group-hover:ring-emerald-500/30"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{c.name}</p>
                                                        <p className="text-[10px] text-gray-500">{c.phone}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-bold text-white bg-gray-800 px-2 py-0.5 rounded w-fit border border-gray-700">
                                                        {c.loanCode || `HS-${c.id}`}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                                        <Calendar size={12} className="text-gray-600" /> Tạo hồ sơ: {c.createdAt || '01/01/2026'}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1.5 relative">
                                                    <span className="text-sm font-bold text-white">
                                                        {c.metrics?.currentDebt || '0 đ'}
                                                    </span>

                                                    <div
                                                        className="relative w-fit"
                                                        onMouseEnter={() => setHoveredLoanId(c.id)}
                                                        onMouseLeave={() => setHoveredLoanId(null)}
                                                    >
                                                        <div className="flex items-center gap-1 text-[10px] text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded cursor-help transition-all hover:bg-blue-500/20">
                                                            <History size={10} /> Lần vay thứ: {c.loanCount || 0}
                                                        </div>

                                                        {hoveredLoanId === c.id && (
                                                            <div className="absolute left-0 top-full mt-2 z-[100] bg-[#1F2937] border border-gray-700 p-4 rounded-xl shadow-2xl min-w-[240px] pointer-events-none animate-in fade-in slide-in-from-top-2 duration-200">
                                                                <div className="flex flex-col gap-3">
                                                                    <p className="text-[10px] text-gray-400 font-bold border-b border-gray-700 pb-2 uppercase tracking-wider">
                                                                        Lịch sử chi tiết
                                                                    </p>

                                                                    {c.products && c.products.length > 0 ? (
                                                                        <div className="space-y-3 text-white">
                                                                            {c.products.map((p: any, index: number) => (
                                                                                <div key={p.id || index} className="flex flex-col gap-1 border-l-2 border-emerald-500/40 pl-3">
                                                                                    <div className="flex items-center justify-between">
                                                                                        <span className="text-[9px] text-gray-500 font-medium">Lần {index + 1}:</span>
                                                                                        <span className={`text-[8px] px-1 rounded ${p.remainingAmount === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                                                            {p.remainingAmount === 0 ? 'Đã xong' : 'Đang nợ'}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="text-[10px] font-bold text-emerald-400">
                                                                                        Vay: {p.loanAmount.toLocaleString('vi-VN')} đ
                                                                                    </div>
                                                                                    <div className="text-[9px] text-gray-500 flex items-center gap-1">
                                                                                        <Calendar size={8} /> {p.loanDate}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-[9px] text-gray-500 italic text-white">Chưa có dữ liệu vay.</div>
                                                                    )}
                                                                    <div className="pt-2 mt-1 border-t border-gray-700 flex justify-between items-center text-white">
                                                                        <span className="text-[9px] text-gray-500 uppercase">Tổng gốc:</span>
                                                                        <span className="text-[10px] text-white font-bold">{c.metrics?.totalLoan}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="absolute -top-1 left-4 w-2 h-2 bg-[#1F2937] border-l border-t border-gray-700 rotate-45"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[9px] text-emerald-500/80 italic">
                                                        <Timer size={10} />
                                                        Giải ngân ngày: {c.products?.[0]?.loanDate || c.createdAt}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${c.status === 'Active'
                                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                    : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                    }`}>
                                                    {c.status === 'Active' ? 'ĐÃ GIẢI NGÂN' : 'ĐANG DUYỆT'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-all" onClick={(e) => e.stopPropagation()}><FileText size={18} /></button>
                                                    <button className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-all" onClick={(e) => e.stopPropagation()}><MoreHorizontal size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    !loading && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-24 text-center text-gray-500 text-sm italic">
                                                Không tìm thấy hồ sơ nào khớp với từ khóa tìm kiếm.
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>

                        {/* Pagination Bar */}
                        <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between bg-[#1F2937]/30">
                            <div className="text-xs text-gray-500">
                                Hiển thị <span className="text-white font-bold">{paginatedCustomers.length}</span> / <span className="text-white font-bold">{customers.length}</span> hồ sơ
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <button 
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                <div className="flex gap-1">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                                currentPage === i + 1 
                                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                                                : 'border border-gray-700 text-gray-400 hover:bg-gray-800'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button 
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="p-2 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <CreateLoanModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateCustomer}
            />
        </div>
    );
}