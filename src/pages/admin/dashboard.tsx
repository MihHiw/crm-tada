"use client";
import Sidebar from '@/components/admin/Sidebar';
import { LOCATION_DATA, RegionKey } from '@/constants/locations';
import { useDashboardData } from '@/hooks/dashboard/useDashboardData';
import {
    Building2,
    Calendar, CheckCircle2, Download,
    Filter,
    LayoutDashboard,
    MapPin, Search, TrendingUp
} from 'lucide-react';
import { useState } from 'react';

// --- Interfaces ---
interface StatItem {
    label: string;
    val: string;
    trend: string;
    color: string;
    icon: any;
}

interface AllocationItem {
    label: string;
    percent: number;
    color: string;
}


export default function DashboardPage() {
    // 1. State bộ lọc (Đồng bộ chặt chẽ với logic Hook)
    const [filters, setFilters] = useState({
        year: '2026',
        month: 'Tất cả',
        region: 'Tất cả',
        province: 'Tất cả',
        city: 'Tất cả'
    });

    const [isConfirmed, setIsConfirmed] = useState(false);

    // 2. Truy xuất dữ liệu qua Hook chuyên dụng
    const { stats, allocations, recentTransactions, loading } = useDashboardData(filters, isConfirmed);

    // --- Logic xử lý Dropdown phụ thuộc: Tự động reset cấp dưới khi cấp trên thay đổi ---
    const handleRegionChange = (val: string) => {
        setFilters(prev => ({
            ...prev,
            region: val,
            province: 'Tất cả',
            city: 'Tất cả'
        }));
        setIsConfirmed(false);
    };

    const handleProvinceChange = (val: string) => {
        setFilters(prev => ({
            ...prev,
            province: val,
            city: 'Tất cả'
        }));
        setIsConfirmed(false);
    };

    const handleConfirmFilter = () => {
        setIsConfirmed(true);
    };

    return (
        <div className="flex min-h-screen bg-[#0B0F1A]">
            <Sidebar adminName="Quản trị viên" />

            <main className="flex-1 flex flex-col min-w-0">
                {/* Header thanh tìm kiếm */}
                <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-[#0B0F1A]/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm mã hồ sơ, khách hàng..."
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-1.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </header>

                <div className="p-8 space-y-8 overflow-y-auto">
                    {/* KHỐI BỘ LỌC PHÂN CẤP */}
                    <div className="flex flex-col gap-6 bg-[#161D2F] p-6 rounded-[24px] border border-gray-800 shadow-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">

                            {/* Lọc Miền */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] text-gray-500 uppercase font-black ml-1 tracking-wider">Vùng Miền</label>
                                <div className="flex items-center gap-2 bg-[#0B0F1A] px-3 py-2 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-colors">
                                    <MapPin size={14} className="text-blue-500" />
                                    <select
                                        className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer w-full"
                                        value={filters.region}
                                        onChange={(e) => handleRegionChange(e.target.value)}
                                    >
                                        <option value="Tất cả" className="bg-[#161D2F]">Tất cả miền</option>
                                        {Object.keys(LOCATION_DATA).map(r => (
                                            <option key={r} value={r} className="bg-[#161D2F]">{r}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Lọc Tỉnh (Disabled nếu chưa chọn Miền) */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] text-gray-500 uppercase font-black ml-1 tracking-wider">Tỉnh / Thành phố</label>
                                <div className={`flex items-center gap-2 bg-[#0B0F1A] px-3 py-2 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-colors ${filters.region === "Tất cả" ? "opacity-40" : ""}`}>
                                    <Building2 size={14} className="text-purple-500" />
                                    <select
                                        className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer w-full disabled:cursor-not-allowed"
                                        value={filters.province}
                                        disabled={filters.region === "Tất cả"}
                                        onChange={(e) => handleProvinceChange(e.target.value)}
                                    >
                                        <option value="Tất cả" className="bg-[#161D2F]">Tất cả Tỉnh</option>
                                        {filters.region !== "Tất cả" &&
                                            Object.keys(LOCATION_DATA[filters.region as RegionKey]).map(p => (
                                                <option key={p} value={p} className="bg-[#161D2F]">{p}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>

                            {/* Lọc Quận (Disabled nếu chưa chọn Tỉnh) */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] text-gray-500 uppercase font-black ml-1 tracking-wider">Quận / Huyện</label>
                                <div className={`flex items-center gap-2 bg-[#0B0F1A] px-3 py-2 rounded-xl border border-gray-800 hover:border-blue-500/50 transition-colors ${filters.province === "Tất cả" ? "opacity-40" : ""}`}>
                                    <Search size={14} className="text-orange-500" />
                                    <select
                                        className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer w-full disabled:cursor-not-allowed"
                                        value={filters.city}
                                        disabled={filters.province === "Tất cả"}
                                        onChange={(e) => {
                                            setFilters(prev => ({ ...prev, city: e.target.value }));
                                            setIsConfirmed(false);
                                        }}
                                    >
                                        <option value="Tất cả" className="bg-[#161D2F]">Tất cả Quận/Huyện</option>
                                        {filters.region !== "Tất cả" && filters.province !== "Tất cả" &&
                                            (LOCATION_DATA[filters.region as RegionKey] as any)[filters.province]?.map((c: string) => (
                                                <option key={c} value={c} className="bg-[#161D2F]">{c}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>

                            {/* Lọc Năm */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] text-gray-500 uppercase font-black ml-1 tracking-wider">Năm</label>
                                <div className="flex items-center gap-2 bg-[#0B0F1A] px-3 py-2 rounded-xl border border-gray-800">
                                    <Calendar size={14} className="text-blue-500" />
                                    <select
                                        className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer w-full"
                                        value={filters.year}
                                        onChange={(e) => {
                                            setFilters(prev => ({ ...prev, year: e.target.value }));
                                            setIsConfirmed(false);
                                        }}
                                    >
                                        <option value="2023" className="bg-[#161D2F]">2023</option>
                                        <option value="2024" className="bg-[#161D2F]">2024</option>
                                        <option value="2025" className="bg-[#161D2F]">2025</option>
                                        <option value="2026" className="bg-[#161D2F]">2026</option>
                                    </select>
                                </div>
                            </div>

                            {/* Lọc Tháng (QUAN TRỌNG: Format padStart(2, '0')) */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] text-gray-500 uppercase font-black ml-1 tracking-wider">Tháng</label>
                                <div className="flex items-center gap-2 bg-[#0B0F1A] px-3 py-2 rounded-xl border border-gray-800">
                                    <Filter size={14} className="text-blue-500" />
                                    <select
                                        className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer w-full"
                                        value={filters.month}
                                        onChange={(e) => {
                                            setFilters(prev => ({ ...prev, month: e.target.value }));
                                            setIsConfirmed(false);
                                        }}
                                    >
                                        <option value="Tất cả" className="bg-[#161D2F]">Cả năm</option>
                                        {Array.from({ length: 12 }, (_, i) => {
                                            const monthVal = String(i + 1).padStart(2, '0');
                                            return (
                                                <option key={i + 1} value={monthVal} className="bg-[#161D2F]">Tháng {i + 1}</option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={handleConfirmFilter}
                                className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-2xl font-black text-xs transition-all shadow-lg shadow-blue-600/30 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 size={18} /> XÁC NHẬN TRUY XUẤT
                            </button>
                        </div>
                    </div>

                    {/* VÙNG HIỂN THỊ KẾT QUẢ */}
                    {!isConfirmed ? (
                        <div className="h-[50vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-700">
                            <div className="w-20 h-20 bg-blue-500/5 rounded-full flex items-center justify-center mb-6 border border-blue-500/10">
                                <LayoutDashboard size={40} className="text-gray-700" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-300">Trung tâm phân tích báo cáo</h2>
                            <p className="text-gray-500 text-xs mt-2">Vui lòng chọn phạm vi và nhấn Xác nhận truy xuất để bắt đầu.</p>
                        </div>
                    ) : loading ? (
                        <div className="h-[50vh] flex flex-col items-center justify-center space-y-4">
                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500 font-bold uppercase text-[9px] tracking-widest text-center">Đang tải dữ liệu báo cáo...</p>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center justify-between border-l-4 border-blue-500 pl-4 py-1">
                                <div>
                                    <h2 className="text-lg font-black text-white uppercase tracking-tight">Báo cáo tổng hợp</h2>
                                    <p className="text-gray-500 text-[10px] font-bold uppercase mt-0.5 tracking-wide">
                                        Phạm vi: {filters.city !== 'Tất cả' ? filters.city : filters.province !== 'Tất cả' ? filters.province : filters.region} | {filters.month !== 'Tất cả' ? `Tháng ${filters.month}` : 'Cả năm'} {filters.year}
                                    </p>
                                </div>
                                <button className="p-2 bg-gray-800/50 rounded-lg text-gray-400 border border-gray-700 hover:text-white transition-colors">
                                    <Download size={18} />
                                </button>
                            </div>

                            {/* Thẻ chỉ số (Stats) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {stats.map((s: StatItem, i: number) => (
                                    <div key={i} className="bg-[#161D2F] rounded-[24px] p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-[#0B0F1A] border border-gray-800 ${s.color}`}>
                                            <s.icon size={22} />
                                        </div>
                                        <p className="text-gray-500 text-[9px] font-black uppercase tracking-wider">{s.label}</p>
                                        <p className="text-2xl font-black mt-1 text-white tabular-nums tracking-tight">{s.val}</p>
                                        <div className="mt-3 flex items-center gap-2">
                                            <span className="text-emerald-500 text-[10px] font-black bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                                <TrendingUp size={10} /> {s.trend}
                                            </span>
                                            <span className="text-gray-600 text-[9px] font-bold uppercase">vs kỳ trước</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Chi tiết giao dịch và tỷ trọng */}
                            <div className="grid grid-cols-12 gap-8">
                                <div className="col-span-12 lg:col-span-4 bg-[#161D2F] rounded-[24px] p-6 border border-gray-800 shadow-xl">
                                    <h3 className="font-black text-white mb-6 uppercase text-[10px] tracking-widest border-b border-gray-800 pb-3">Phân bổ danh mục</h3>
                                    <div className="space-y-6">
                                        {allocations.map((item: AllocationItem, idx: number) => (
                                            <div key={idx} className="space-y-2">
                                                <div className="flex justify-between text-[10px] font-black uppercase">
                                                    <span className="text-gray-500">{item.label}</span>
                                                    <span className="text-white">{item.percent}%</span>
                                                </div>
                                                <div className="w-full bg-[#0B0F1A] h-1.5 rounded-full overflow-hidden border border-gray-800">
                                                    <div className={`${item.color} h-full transition-all duration-1000`} style={{ width: `${item.percent}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-span-12 lg:col-span-8 bg-[#161D2F] rounded-[24px] border border-gray-800 overflow-hidden shadow-xl">
                                    <div className="p-6 border-b border-gray-800 bg-[#1F2937]/20 flex justify-between items-center">
                                        <h3 className="font-black text-white uppercase text-[10px] tracking-widest">Dòng tiền chi tiết</h3>
                                        <span className="text-[9px] text-emerald-500 font-bold uppercase animate-pulse tracking-tighter">Live Monitor</span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="text-gray-500 text-[9px] uppercase font-black bg-[#0B0F1A]/50">
                                                <tr>
                                                    <th className="px-6 py-4">Đối tác/Khách hàng</th>
                                                    <th className="px-6 py-4">Sản phẩm vay</th>
                                                    <th className="px-6 py-4">Hợp đồng</th>
                                                    <th className="px-6 py-4 text-right">Tình trạng</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-800/50">
                                                {recentTransactions.length > 0 ? recentTransactions.map((tx: any) => (
                                                    <tr key={tx.id} className="hover:bg-blue-500/[0.02] transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-[10px] font-black text-blue-400 border border-gray-700">
                                                                    {tx.name.substring(0, 2).toUpperCase()}
                                                                </div>
                                                                <span className="font-bold text-white text-xs">{tx.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-[10px] text-gray-400 font-bold uppercase tracking-tight">{tx.type}</td>
                                                        <td className="px-6 py-4 text-xs font-black text-blue-100 tabular-nums">{tx.val}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <span className={`px-3 py-1 text-[8px] font-black uppercase rounded-md border ${tx.status === 'Hoàn thành'
                                                                ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5'
                                                                : 'text-orange-500 border-orange-500/20 bg-orange-500/5'
                                                                }`}>
                                                                {tx.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-10 text-center text-gray-500 text-xs italic tracking-widest uppercase font-black opacity-30">
                                                            -- Dữ liệu trống trong kỳ này --
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}