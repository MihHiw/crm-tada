"use client";

import ActionButton from '@/components/admin/ActionButton';
import { Sidebar } from '@/components/admin/Sidebar';
import StatCard from '@/components/admin/StatCard';
import GlobalBackground from '@/components/GlobalBackground';
import { TimeFilter, useBookingManagement } from '@/hooks/booking/useBookingManagement';
import { BookingStatus } from '@/types/types';
import { format, parseISO } from 'date-fns';
import {
    AlertCircle, Banknote, Calendar, CalendarCheck, CheckCheck,
    CheckCircle2, ChevronLeft, ChevronRight,
    MoreVertical, Search, XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

// --- 1. CONFIG UI CHO TRẠNG THÁI (Đã chỉnh màu cho nền tối) ---
interface StatusUIConfig {
    label: string;
    style: string;
}

const StatusBadge = ({ status }: { status: BookingStatus }) => {
    const config: Record<string, StatusUIConfig> = {
        pending: { label: "Chờ xác nhận", style: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
        confirmed: { label: "Sắp tới", style: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
        completed: { label: "Hoàn thành", style: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
        cancelled: { label: "Đã hủy", style: "bg-white/10 text-white/50 border-white/10" },
        // Fallback states
        in_progress: { label: "Đang làm", style: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
        no_show: { label: "K.Không đến", style: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
    };

    const active = config[status] || config.pending;

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide shadow-sm ${active.style}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${active.style.split(' ')[0].replace('/20', '')}`} />
            {active.label}
        </span>
    );
};

export default function BookingManagement() {
    const { state, setters, actions } = useBookingManagement();
    const { filteredBookings, activeTab, searchTerm, stats, timeFilter, selectedDate, loading } = state;

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchTerm, timeFilter, selectedDate]);

    const tabConfigs = [
        { id: 'all', label: 'Tất cả' },
        { id: 'pending', label: 'Chờ duyệt' },
        { id: 'confirmed', label: 'Sắp tới' },
        { id: 'completed', label: 'Hoàn thành' },
        { id: 'cancelled', label: 'Đã hủy' },
    ];

    return (
        // Root: text-white, overflow-hidden để fix layout
        <div className="flex h-screen w-full overflow-hidden font-sans text-white">
            <GlobalBackground />

            {/* Sidebar Container: Kính mờ */}
            <div className="w-[260px] flex-shrink-0 h-full border-r border-white/10 bg-slate-900/60 backdrop-blur-xl z-20">
                <Sidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 h-full overflow-y-auto relative z-10 scrollbar-hide">
                <div className="max-w-[1600px] mx-auto p-6 md:p-10 flex flex-col h-full space-y-8">

                    {/* HEADER SECTION */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Quản lý lịch hẹn</h1>
                            <p className="text-white/60 text-sm font-medium">Theo dõi và điều phối lịch thực hiện dịch vụ.</p>
                        </div>

                  

                        {timeFilter !== 'all' && (
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2 px-4 rounded-2xl border border-white/10 shadow-lg">
                                <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Thời gian:</span>
                                <input
                                    type={timeFilter === 'today' ? 'date' : timeFilter === 'month' ? 'month' : 'number'}
                                    value={timeFilter === 'year' ? selectedDate.split('-')[0] : selectedDate.substring(0, timeFilter === 'month' ? 7 : 10)}
                                    onChange={(e) => setters.setSelectedDate(e.target.value)}
                                    className="outline-none text-sm font-bold text-rose-400 bg-transparent border-b border-rose-400/50 pb-0.5 focus:border-rose-400 transition-colors cursor-pointer"
                                />
                            </div>
                        )}
                    </div>

                    {/* STATS CARDS (GRID) */}
                    {/* Lưu ý: Bạn cần vào component StatCard và sửa lại bg-white thành bg-white/5 giống CustomerStats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard icon={<Calendar className="text-rose-400" />} color="rose" label="Tổng số lịch" value={stats.total} />
                        <StatCard icon={<AlertCircle className="text-amber-400" />} color="yellow" label="Chờ duyệt" value={stats.pendingCount} />
                        <StatCard icon={<CalendarCheck className="text-indigo-400" />} color="purple" label="Sắp tới" value={stats.confirmedCount} />
                        <StatCard icon={<Banknote className="text-emerald-400" />} color="green" label="Doanh thu hoàn thành" value={actions.formatCurrency(stats.revenue)} />
                    </div>

                    {/* MAIN TABLE CONTAINER (GLASS) */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/10 flex flex-col overflow-hidden flex-1 min-h-[500px]">

                        {/* TOOLBAR SECTION */}
                        <div className="p-6 border-b border-white/5 flex flex-col xl:flex-row justify-between items-center gap-6">

                            {/* Tabs Filter */}
                            <div className="flex bg-black/20 p-1 rounded-xl border border-white/5 overflow-x-auto max-w-full no-scrollbar">
                                {tabConfigs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setters.setActiveTab(tab.id as BookingStatus | 'all')}
                                        className={`px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap uppercase tracking-wide ${activeTab === tab.id
                                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40'
                                            : 'text-white/60 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
                                {/* Time Filter Buttons */}
                                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full md:w-auto">
                                    {['all', 'today', 'month', 'year'].map((id) => (
                                        <button
                                            key={id}
                                            onClick={() => setters.setTimeFilter(id as TimeFilter)}
                                            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase ${timeFilter === id
                                                ? 'bg-white/20 text-white shadow-sm'
                                                : 'text-white/50 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {id === 'all' ? 'Tất cả' : id === 'today' ? 'Ngày' : id === 'month' ? 'Tháng' : 'Năm'}
                                        </button>
                                    ))}
                                </div>

                                {/* Search Box */}
                                <div className="relative group w-full md:w-64">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-rose-400 transition-colors" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Tên, số điện thoại..."
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-black/20 outline-none text-sm text-white placeholder-white/30 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all"
                                        value={searchTerm}
                                        onChange={(e) => setters.setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* TABLE CONTENT */}
                        <div className="overflow-x-auto flex-1 custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 z-10 bg-[#0f172a]/90 backdrop-blur-md border-b border-white/10">
                                    <tr className="text-white/50 text-[10px] uppercase font-bold tracking-widest">
                                        <th className="px-8 py-5">Khách hàng</th>
                                        <th className="px-6 py-5">Dịch vụ</th>
                                        <th className="px-6 py-5">Thời gian</th>
                                        <th className="px-6 py-5 text-center">Trạng thái</th>
                                        <th className="px-8 py-5 text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr><td colSpan={5} className="py-20 text-center text-white/50 animate-pulse">Đang tải dữ liệu...</td></tr>
                                    ) : currentItems.length > 0 ? (
                                        currentItems.map((booking) => {
                                            const startDate = parseISO(booking.start_time);
                                            return (
                                                <tr key={booking.id} className="group hover:bg-white/5 transition-all">
                                                    <td className="px-8 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-white">{booking.customer_name}</span>
                                                            <span className="text-xs font-mono text-white/50 mt-0.5">{booking.customer_phone}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-white/90 truncate max-w-[200px]" title={booking.service_name}>{booking.service_name}</span>
                                                            <span className="text-xs font-bold text-rose-400 mt-0.5">{actions.formatCurrency(booking.total_price)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-white text-sm font-bold">{format(startDate, 'HH:mm')}</div>
                                                        <div className="text-white/50 text-[11px] font-medium uppercase mt-0.5">{format(startDate, 'dd/MM/yyyy')}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <StatusBadge status={booking.status} />
                                                    </td>
                                                    <td className="px-8 py-4 text-right">
                                                        <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                            {booking.status === 'pending' && <ActionButton onClick={() => actions.approveBooking(booking.id)} icon={<CheckCircle2 size={16} />} color="green" title="Duyệt" />}
                                                            {booking.status === 'confirmed' && <ActionButton onClick={() => actions.completeBooking(booking.id)} icon={<CheckCheck size={16} />} color="blue" title="Hoàn thành" />}
                                                            {(booking.status === 'pending' || booking.status === 'confirmed') && <ActionButton onClick={() => actions.cancelBooking(booking.id)} icon={<XCircle size={16} />} color="red" title="Hủy" />}
                                                            <button className="p-2 text-white/50 hover:bg-white/10 hover:text-white rounded-lg transition-colors"><MoreVertical size={16} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr><td colSpan={5} className="py-20 text-center text-white/30 italic">Không tìm thấy lịch hẹn nào</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION FOOTER */}
                        {filteredBookings.length > 0 && (
                            <div className="px-8 py-4 bg-black/20 border-t border-white/5 flex items-center justify-between text-white">
                                <p className="text-xs text-white/50 font-medium">
                                    Trang <span className="font-bold text-white">{currentPage}</span> / {totalPages}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 border border-white/10 rounded-lg bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 border border-white/10 rounded-lg bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Style cho thanh cuộn */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}