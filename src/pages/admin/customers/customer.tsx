"use client";
import Sidebar from '@/components/admin/Sidebar';
import { useCustomers } from '@/hooks/customer/useCustomers';
import { Bell, Filter, HelpCircle, Loader2, MoreHorizontal, Plus, Search } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CustomerList() {
    const router = useRouter();
    const { customers, loading, searchTerm, setSearchTerm } = useCustomers();

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


    if (!admin || admin.role !== 'admin') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-gray-900">Đang xác thực quyền Admin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#0B0F1A]">
            {/* Sidebar bên trái */}
            <Sidebar adminName={admin.name} />


            {/* Content bên phải */}
            <main className="flex-1 overflow-y-auto">
                {/* Top Navbar giả lập trong content */}
                <div className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-[#0B0F1A]/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm khách hàng, hợp đồng..."
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-1.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                        <button className="hover:text-white"><Bell size={20} /></button>
                        <button className="hover:text-white"><HelpCircle size={20} /></button>
                    </div>
                </div>

                {/* Nội dung trang Khách hàng (Phần cũ của bạn) */}
                <div className="p-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">Khách hàng</h1>
                            <p className="text-gray-400 text-sm">Quản lý và theo dõi danh sách khách hàng của bạn.</p>
                        </div>
                        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                            <Plus size={20} /> Tạo mới
                        </button>
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-[#161D2F] p-4 rounded-2xl border border-gray-800 mb-6 flex gap-4 items-center shadow-sm">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tìm kiếm theo tên, ID, SĐT hoặc Email..."
                                className="w-full bg-[#0B0F1A] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0B0F1A] border border-gray-800 rounded-xl text-gray-400 text-sm font-medium hover:bg-gray-800 hover:text-white transition-colors">
                            <Filter size={16} /> Bộ lọc
                        </button>
                    </div>

                    {/* Table Container */}
                    <div className="bg-[#161D2F] rounded-2xl border border-gray-800 overflow-hidden min-h-[500px] relative shadow-2xl">
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-[#161D2F]/60 backdrop-blur-[2px] z-20 transition-all">
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="text-blue-500 animate-spin" size={40} />
                                    <span className="text-blue-500 text-xs font-medium">Đang tìm kiếm...</span>
                                </div>
                            </div>
                        )}

                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#1F2937]/50 text-gray-400 text-[10px] uppercase tracking-[0.1em]">
                                <tr>
                                    <th className="px-6 py-5 font-bold">Khách hàng</th>
                                    <th className="px-6 py-5 font-bold">Tài sản (AUM)</th>
                                    <th className="px-6 py-5 font-bold text-center">Trạng thái</th>
                                    <th className="px-6 py-5 font-bold">Tín dụng</th>
                                    <th className="px-6 py-5 font-bold text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {customers.length > 0 ? (
                                    customers.map((c) => (
                                        <tr
                                            key={c.id}
                                            onClick={() => router.push(`/admin/customers/${c.id}`)}
                                            className="hover:bg-blue-500/5 transition-all cursor-pointer group"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-11 h-11 flex-shrink-0">
                                                        <Image
                                                            src={c.avatar}
                                                            alt={c.name}
                                                            fill
                                                            sizes="44px"
                                                            className="rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-500/30 transition-all"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                                                            {c.name}
                                                        </p>
                                                        <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{c.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm font-bold text-white">
                                                    {c.metrics?.aum || (c as any).aum || "0"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${c.status === 'Active'
                                                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                    : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                                    }`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-bold">
                                                <span className="text-blue-400">
                                                    {c.metrics?.creditScore || (c as any).credit || "N/A"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="text-gray-500 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition-all"
                                                >
                                                    <MoreHorizontal size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    !loading && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-24 text-center">
                                                <div className="flex flex-col items-center gap-3 opacity-40">
                                                    <Search size={48} className="text-gray-500" />
                                                    <p className="text-gray-400 font-medium">
                                                        Không tìm thấy khách hàng phù hợp với &quot;{searchTerm}&quot;
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}