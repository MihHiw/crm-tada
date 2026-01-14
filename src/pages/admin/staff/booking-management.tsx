import ActionButton from '@/components/admin/ActionButton';
import { Sidebar } from '@/components/admin/Sidebar';
import StatCard from '@/components/admin/StatCard';
import { TimeFilter, useBookingManagement } from '@/hooks/booking/useBookingManagement';
import { BookingStatus } from '@/types/types';
import { format, parseISO } from 'date-fns';
import {
    AlertCircle, Banknote, Calendar, CalendarCheck, CheckCheck,
    CheckCircle2, ChevronLeft, ChevronRight,
    MoreVertical, Search, XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';

// 1. Định nghĩa interface cho nội dung hiển thị của mỗi trạng thái
interface StatusUIConfig {
    label: string;
    style: string;
}

const StatusBadge = ({ status }: { status: BookingStatus }) => {
    // 2. Sử dụng Record<BookingStatus, ...> để ép buộc phải khai báo đầy đủ các case trong Enum/Type
    // Nếu BookingStatus của bạn có 'in_progress' hay 'no_show', hãy thêm vào đây.
    const config: Record<string, StatusUIConfig> = {
        pending: { label: "Chờ xác nhận", style: "bg-amber-50 text-amber-700 border-amber-200" },
        confirmed: { label: "Sắp tới", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        completed: { label: "Hoàn thành", style: "bg-blue-50 text-blue-700 border-blue-200" },
        cancelled: { label: "Đã hủy", style: "bg-slate-50 text-slate-500 border-slate-200" },
        // Thêm các trạng thái mở rộng nếu cần để tránh lỗi Property '...' is missing
        in_progress: { label: "Đang làm", style: "bg-indigo-50 text-indigo-700 border-indigo-200" },
        no_show: { label: "Khách không đến", style: "bg-red-50 text-red-700 border-red-200" },
    };

    // Truy cập an toàn: Nếu status lạ không có trong config, mặc định hiện 'pending'
    const active = config[status] || config.pending;

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-sm ${active.style}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${active.style.split(' ')[1].replace('text', 'bg')}`} />
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
        <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
            <Sidebar />

            <main className="flex-1 lg:ml-64 p-8 transition-all">
                <div className="max-w-7xl mx-auto flex flex-col gap-8">

                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Quản lý lịch hẹn</h1>
                            <p className="text-slate-500 font-medium">Theo dõi và điều phối lịch thực hiện dịch vụ</p>
                        </div>

                        {timeFilter !== 'all' && (
                            <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-2xl border border-slate-200 shadow-sm">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thời gian:</span>
                                <input
                                    type={timeFilter === 'today' ? 'date' : timeFilter === 'month' ? 'month' : 'number'}
                                    value={timeFilter === 'year' ? selectedDate.split('-')[0] : selectedDate.substring(0, timeFilter === 'month' ? 7 : 10)}
                                    onChange={(e) => setters.setSelectedDate(e.target.value)}
                                    className="outline-none text-sm font-black text-rose-500 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100"
                                />
                            </div>
                        )}
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard icon={<Calendar className="text-rose-500" />} color="rose" label="Tổng số lịch" value={stats.total} />
                        <StatCard icon={<AlertCircle className="text-amber-500" />} color="yellow" label="Chờ duyệt" value={stats.pendingCount} />
                        <StatCard icon={<CalendarCheck className="text-indigo-500" />} color="purple" label="Sắp tới" value={stats.confirmedCount} />
                        <StatCard icon={<Banknote className="text-emerald-500" />} color="green" label="Doanh thu hoàn thành" value={actions.formatCurrency(stats.revenue)} />
                    </div>

                    {/* Main Container */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px]">

                        {/* Toolbar */}
                        <div className="p-6 border-b border-slate-100 flex flex-col xl:flex-row justify-between items-center gap-6">
                            <div className="flex bg-slate-100/80 p-1 rounded-2xl overflow-x-auto no-scrollbar w-full xl:w-auto">
                                {tabConfigs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        // FIX LỖI: Cast tab.id về kiểu mong muốn thay vì any
                                        onClick={() => setters.setActiveTab(tab.id as BookingStatus | 'all')}
                                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row items-center gap-4 w-full xl:w-auto">
                                <div className="flex bg-rose-50/50 p-1 rounded-xl border border-rose-100 w-full md:w-auto">
                                    {['all', 'today', 'month', 'year'].map((id) => (
                                        <button
                                            key={id}
                                            onClick={() => setters.setTimeFilter(id as TimeFilter)}
                                            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-black transition-all ${timeFilter === id ? 'bg-rose-500 text-white shadow-md' : 'text-rose-400 hover:text-rose-600'}`}
                                        >
                                            {id === 'all' ? 'Tất cả' : id === 'today' ? 'Ngày' : id === 'month' ? 'Tháng' : 'Năm'}
                                        </button>
                                    ))}
                                </div>

                                <div className="relative group w-full md:w-64">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Tên, số điện thoại..."
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-100 outline-none text-sm font-medium"
                                        value={searchTerm}
                                        onChange={(e) => setters.setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-slate-400 text-[11px] uppercase font-black bg-slate-50/50">
                                        <th className="px-8 py-4 border-b">Khách hàng</th>
                                        <th className="px-6 py-4 border-b">Dịch vụ</th>
                                        <th className="px-6 py-4 border-b">Thời gian</th>
                                        <th className="px-6 py-4 border-b text-center">Trạng thái</th>
                                        <th className="px-8 py-4 border-b text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {loading ? (
                                        <tr><td colSpan={5} className="py-20 text-center">Đang tải...</td></tr>
                                    ) : currentItems.length > 0 ? (
                                        currentItems.map((booking) => {
                                            const startDate = parseISO(booking.start_time);
                                            return (
                                                <tr key={booking.id} className="group hover:bg-slate-50/80 transition-all">
                                                    <td className="px-8 py-5">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-black text-slate-700">{booking.customer_name}</span>
                                                            <span className="text-xs font-medium text-slate-400">{booking.customer_phone}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-slate-600 truncate max-w-[180px]">{booking.service_name}</span>
                                                            <span className="text-xs font-black text-rose-500">{actions.formatCurrency(booking.total_price)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="text-slate-600 text-[13px] font-bold">{format(startDate, 'HH:mm')}</div>
                                                        <div className="text-slate-400 text-[11px]">{format(startDate, 'dd/MM/yyyy')}</div>
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        <StatusBadge status={booking.status} />
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                            {booking.status === 'pending' && <ActionButton onClick={() => actions.approveBooking(booking.id)} icon={<CheckCircle2 size={18} />} color="green" title="Duyệt" />}
                                                            {booking.status === 'confirmed' && <ActionButton onClick={() => actions.completeBooking(booking.id)} icon={<CheckCheck size={18} />} color="blue" title="Hoàn thành" />}
                                                            {(booking.status === 'pending' || booking.status === 'confirmed') && <ActionButton onClick={() => actions.cancelBooking(booking.id)} icon={<XCircle size={18} />} color="red" title="Hủy" />}
                                                            <button className="p-2"><MoreVertical size={18} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr><td colSpan={5} className="py-20 text-center font-bold text-slate-400">Không tìm thấy lịch hẹn</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredBookings.length > 0 && (
                            <div className="p-6 border-t flex items-center justify-between bg-slate-50/30">
                                <p className="text-sm font-bold text-slate-500">
                                    Trang <span className="text-slate-900">{currentPage}</span> / {totalPages}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 border rounded-xl bg-white disabled:opacity-30"><ChevronLeft size={18} /></button>
                                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 border rounded-xl bg-white disabled:opacity-30"><ChevronRight size={18} /></button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}