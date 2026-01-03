"use client";
import Sidebar from '@/components/admin/Sidebar'; // Đảm bảo đường dẫn import đúng
import { useDashboardData } from '@/hooks/dashboard/useDashboardData';
import { Bell, Calendar, Download, HelpCircle, Search, TrendingUp } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

export default function DashboardPage() {
    const { chartData, stats, allocations, recentTransactions, loading } = useDashboardData();

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-[#0B0F1A] text-white">
            Đang tải dữ liệu...
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#0B0F1A]">
            {/* Sidebar cố định bên trái */}
            <Sidebar adminName="Quản trị viên" />

            {/* Nội dung chính bên phải */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Top Header/Navbar */}
                <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-[#0B0F1A]/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm báo cáo, dữ liệu..."
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-1.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                        <button className="hover:text-white transition-colors"><Bell size={20} /></button>
                        <button className="hover:text-white transition-colors"><HelpCircle size={20} /></button>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-8 space-y-8 overflow-y-auto">
                    {/* Header Section */}
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Trang tổng quan</h1>
                            <p className="text-gray-500 text-sm mt-1">Cập nhật lần cuối: Hôm nay, 09:41</p>
                        </div>
                        <div className="flex gap-3 text-white">
                            <button className="flex items-center gap-2 bg-[#161D2F] px-4 py-2 rounded-xl text-sm border border-gray-800 hover:bg-gray-800 transition-all">
                                <Calendar size={16} className="text-blue-500" /> Tháng này
                            </button>
                            <button className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
                                <Download size={16} /> Xuất báo cáo
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((s, i) => (
                            <div key={i} className="bg-[#161D2F] rounded-[32px] p-6 border border-gray-800 hover:border-blue-500/30 transition-all cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2 rounded-xl bg-gray-800/50 ${s.color}`}>
                                        <s.icon size={20} />
                                    </div>
                                    <span className="text-green-500 text-[10px] font-bold bg-green-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        {s.trend} <TrendingUp size={10} />
                                    </span>
                                </div>
                                <p className="text-gray-500 text-xs font-medium">{s.label}</p>
                                <p className="text-xl font-bold mt-1 tracking-tight text-white">{s.val}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-12 gap-6">
                        {/* Trend Chart */}
                        <div className="col-span-12 lg:col-span-8 bg-[#161D2F] rounded-[32px] p-8 border border-gray-800">
                            <div className="flex justify-between items-start mb-6 text-white">
                                <div>
                                    <h3 className="text-gray-500 text-sm font-medium">Xu hướng dòng tiền</h3>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-2xl font-bold">15.4 tỷ</span>
                                        <span className="text-green-500 text-xs font-bold">+12% vs năm ngoái</span>
                                    </div>
                                </div>
                                <select className="bg-[#0B0F1A] border border-gray-800 rounded-lg px-3 py-1 text-xs text-gray-400 focus:outline-none">
                                    <option>Năm nay</option>
                                </select>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Tooltip contentStyle={{ backgroundColor: '#161D2F', border: '1px solid #1f2937', borderRadius: '12px', color: '#fff' }} />
                                        <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 12 }} dy={10} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Right Sidebar Stats */}
                        <div className="col-span-12 lg:col-span-4 space-y-6 text-white">
                            {/* Portfolio Allocation */}
                            <div className="bg-[#161D2F] rounded-[32px] p-6 border border-gray-800">
                                <h3 className="font-bold mb-6 flex justify-between items-center text-white">
                                    Phân bổ danh mục <span className="text-[10px] text-gray-500 font-normal uppercase">Q3 2023</span>
                                </h3>
                                <div className="space-y-4">
                                    {allocations.map((item, idx) => (
                                        <div key={idx} className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className="text-gray-400">{item.label}</span>
                                                <span>{item.percent}%</span>
                                            </div>
                                            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                                <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.percent}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sales Performance */}
                            <div className="bg-[#161D2F] rounded-[32px] p-6 border border-gray-800">
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="font-bold">Hiệu suất bán hàng</h3>
                                    <span className="text-green-500 text-[10px] font-bold">120% Target</span>
                                </div>
                                <div className="flex items-end justify-around h-24 gap-2">
                                    <div className="w-8 bg-gray-800 rounded-t-sm h-[40%]"></div>
                                    <div className="w-10 bg-blue-500 rounded-t-sm h-[90%] shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                                    <div className="w-8 bg-gray-800 rounded-t-sm h-[25%]"></div>
                                </div>
                                <div className="flex justify-around mt-2 text-[10px] text-gray-500 uppercase font-bold">
                                    <span>Nhóm A</span>
                                    <span className="text-blue-500">Nhóm B</span>
                                    <span>Nhóm C</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="bg-[#161D2F] rounded-[32px] border border-gray-800 overflow-hidden text-white mb-8">
                        <div className="p-8 flex justify-between items-center">
                            <h3 className="font-bold text-lg">Giao dịch gần đây</h3>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                                <input className="w-full bg-[#0B0F1A] border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500" placeholder="Tìm kiếm giao dịch..." />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#1F2937]/50 text-gray-500 text-[10px] uppercase tracking-widest border-b border-gray-800">
                                    <tr>
                                        <th className="px-8 py-4">Khách hàng</th>
                                        <th className="px-8 py-4">Loại giao dịch</th>
                                        <th className="px-8 py-4">Ngày</th>
                                        <th className="px-8 py-4">Giá trị</th>
                                        <th className="px-8 py-4 text-right">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {recentTransactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-8 py-5 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                                                <div className="text-sm font-bold">{tx.name}</div>
                                            </td>
                                            <td className="px-8 py-5 text-sm text-gray-400">{tx.type}</td>
                                            <td className="px-8 py-5 text-sm text-gray-400">{tx.date}</td>
                                            <td className="px-8 py-5 text-sm font-bold">{tx.val}</td>
                                            <td className="px-8 py-5 text-right">
                                                <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${tx.status === 'Hoàn thành' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}