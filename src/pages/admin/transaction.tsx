"use client";
import Sidebar from '@/components/admin/Sidebar'; // Đảm bảo đường dẫn import đúng
import { useTransactions } from '@/hooks/transaction/useTransactions';
import { TRANSACTION_STATS } from '@/mocks/transaction';
import { Bell, Download, FileText, HelpCircle, MoreVertical, Plus, Search, TrendingUp } from 'lucide-react';

export default function TransactionPage() {
    const { transactions, searchTerm, setSearchTerm, setStatusFilter } = useTransactions();

    return (
        <div className="flex min-h-screen bg-[#0B0F1A]">
            {/* 1. Sidebar cố định bên trái */}
            <Sidebar adminName="Quản trị viên" />

            {/* 2. Nội dung chính bên phải */}
            <main className="flex-1 flex flex-col min-w-0">

                {/* Top Navbar phụ cho trang Giao dịch */}
                <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-[#0B0F1A]/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Quản trị</span>
                        <span className="text-gray-700">/</span>
                        <span className="text-white font-medium">Giao dịch</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                        <button className="hover:text-white transition-colors"><Bell size={20} /></button>
                        <button className="hover:text-white transition-colors"><HelpCircle size={20} /></button>
                    </div>
                </header>

                {/* Nội dung trang Giao dịch */}
                <div className="p-8 space-y-8 overflow-y-auto">
                    {/* Header Section */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Quản lý giao dịch</h1>
                            <p className="text-gray-400 text-sm mt-1">Theo dõi, kiểm tra và xử lý các giao dịch tài chính mới nhất</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 bg-[#161D2F] px-4 py-2 rounded-xl text-sm border border-gray-800 hover:bg-gray-800 transition-all text-white">
                                <Download size={16} /> Xuất báo cáo
                            </button>
                            <button className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all text-white">
                                <Plus size={16} /> Tạo giao dịch
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {TRANSACTION_STATS.map((stat, i) => (
                            <div key={i} className="bg-[#161D2F] rounded-2xl p-6 border border-gray-800">
                                <p className="text-gray-400 text-xs font-medium">{stat.label}</p>
                                <div className="flex items-end justify-between mt-2">
                                    <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${stat.trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {stat.trend} <TrendingUp size={10} />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-[#161D2F] p-4 rounded-2xl border border-gray-800 flex flex-wrap gap-4 items-center shadow-sm">
                        <div className="flex-1 min-w-[300px] relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Tìm theo mã GD, tên khách, số tiền..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#0B0F1A] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                            />
                        </div>
                        <select
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-[#0B0F1A] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-400 focus:outline-none cursor-pointer"
                        >
                            <option>Tất cả trạng thái</option>
                            <option>Hoàn thành</option>
                            <option>Chờ xử lý</option>
                            <option>Thất bại</option>
                        </select>
                        <button className="px-4 py-2.5 bg-[#0B0F1A] border border-gray-800 rounded-xl text-gray-400 text-sm hover:text-white transition-colors">Tháng này</button>
                        <button className="px-4 py-2.5 bg-[#0B0F1A] border border-gray-800 rounded-xl text-gray-400 text-sm hover:text-white transition-colors">Loại GD</button>
                    </div>

                    {/* Transactions Table */}
                    <div className="bg-[#161D2F] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl mb-8">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#1F2937]/50 text-gray-400 text-[10px] uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-5 font-bold">Mã GD</th>
                                        <th className="px-6 py-5 font-bold">Ngày giờ</th>
                                        <th className="px-6 py-5 font-bold">Khách hàng</th>
                                        <th className="px-6 py-5 font-bold">Loại</th>
                                        <th className="px-6 py-5 font-bold">Số tiền</th>
                                        <th className="px-6 py-5 font-bold">Trạng thái</th>
                                        <th className="px-6 py-5 font-bold text-center">Tài liệu</th>
                                        <th className="px-6 py-5 font-bold text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800 text-white">
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-blue-500/5 transition-all group cursor-pointer">
                                            <td className="px-6 py-5 text-sm font-bold text-blue-400">#{tx.id}</td>
                                            <td className="px-6 py-5">
                                                <p className="text-sm font-medium">{tx.date}</p>
                                                <p className="text-[10px] text-gray-500">{tx.time}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-[10px] font-bold">
                                                        {tx.customer.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{tx.customer}</p>
                                                        <p className="text-[10px] text-gray-500">{tx.customerId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-gray-300">{tx.type}</td>
                                            <td className={`px-6 py-5 text-sm font-bold ${tx.amount > 0 ? 'text-white' : 'text-gray-300'}`}>
                                                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('vi-VN')} đ
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 w-fit ${tx.status === 'Hoàn thành' ? 'bg-green-500/10 text-green-500' :
                                                    tx.status === 'Chờ xử lý' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${tx.status === 'Hoàn thành' ? 'bg-green-500' :
                                                        tx.status === 'Chờ xử lý' ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}></span>
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <FileText size={18} className="mx-auto text-gray-500 hover:text-white transition-colors" />
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-gray-700 transition-colors">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Placeholder */}
                        <div className="p-6 border-t border-gray-800 flex justify-between items-center text-xs text-gray-500">
                            <p>Hiển thị 1-10 trong số 124 giao dịch</p>
                            <div className="flex gap-2">
                                {[1, 2, 3, '...', 12].map((p, i) => (
                                    <button key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all ${p === 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'}`}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}