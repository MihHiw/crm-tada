"use client";
import {
    Briefcase,
    ChevronDown,
    DollarSign,
    Download,
    FileText,
    ShieldCheck,
    TrendingUp,
    UserMinus,
    Users
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useSyncExternalStore } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

// Import các thành phần nội bộ
import Sidebar from '@/components/admin/Sidebar';
import { useReports } from '@/hooks/report/useReports';
import { QUICK_REPORT_TEMPLATES, REVENUE_ALLOCATION } from '@/mocks/report';

// Tắt SSR cho Modal để tránh lỗi Hydration
const CreateReportModal = dynamic(() => import('@/components/admin/Modal/CreateReportModal'), {
    ssr: false
});

// 1. Mảng Icon cố định để map theo thứ tự stats (Vì Hook đã bỏ thuộc tính icon)
const STAT_ICONS = [DollarSign, TrendingUp, Users, UserMinus];

// 2. Map Icon cho danh sách mẫu báo cáo
const TEMPLATE_ICONS: Record<number, any> = {
    0: FileText,
    1: ShieldCheck,
    2: Briefcase
};

// 3. Helper để xử lý Hydration an toàn (Thay thế useEffect/mounted)
const subscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function ReportsPage() {
    // Kiểm tra client-side an toàn để tránh lỗi "Calling setState synchronously"
    const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const {
        timeRange,
        setTimeRange,
        stats,
        chartData,
        exportData,
        isModalOpen,
        selectedTemplate,
        openReportModal,
        closeReportModal,
        handleCreateReport
    } = useReports();

    if (!isClient) return <div className="min-h-screen bg-[#0B0F1A]" />;

    return (
        <div className="flex min-h-screen bg-[#0B0F1A]">
            <Sidebar adminName="Quản trị viên" />

            <main className="flex-1 p-8 space-y-8 overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Phân tích & Báo cáo</h1>
                        <p className="text-gray-400 text-sm mt-1">Theo dõi hiệu suất tài chính và tạo báo cáo chi tiết</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative group">
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="appearance-none bg-[#161D2F] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none pr-10 hover:border-blue-500/50 transition-all cursor-pointer"
                            >
                                <option>30 ngày qua</option>
                                <option>90 ngày qua</option>
                                <option>Năm nay</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                        </div>
                        <button
                            onClick={exportData}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                        >
                            <Download size={16} /> Xuất dữ liệu
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => {
                        const Icon = STAT_ICONS[i] || DollarSign;
                        return (
                            <div key={i} className="bg-[#161D2F] rounded-2xl p-6 border border-gray-800 hover:border-blue-500/30 transition-all group">
                                <div className="flex justify-between items-start">
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                                    <div className={`p-2 rounded-lg bg-gray-800/50 ${stat.color}`}>
                                        <Icon size={18} />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                                    <p className={`text-[11px] font-bold mt-1 flex items-center gap-1 ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                        {stat.trend}
                                        <span className="text-gray-500 font-normal ml-1">vs tháng trước</span>
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-8 bg-[#161D2F] rounded-[32px] p-8 border border-gray-800 shadow-sm">
                        <h3 className="text-white font-bold text-lg mb-8">Xu hướng doanh thu</h3>
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#161D2F', border: '1px solid #1f2937', borderRadius: '16px', color: '#fff' }}
                                    />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 11 }} dy={15} />
                                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Progress Bars */}
                    <div className="col-span-12 lg:col-span-4 bg-[#161D2F] rounded-[32px] p-8 border border-gray-800">
                        <h3 className="text-white font-bold mb-1 text-lg">Phân bổ doanh thu</h3>
                        <p className="text-gray-500 text-[11px] mb-8 uppercase tracking-widest font-bold">Theo loại dịch vụ</p>
                        <div className="space-y-7">
                            {REVENUE_ALLOCATION.map((item, i) => (
                                <div key={i} className="space-y-2.5">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400 font-medium">{item.label}</span>
                                        <span className="text-white font-bold">{item.percent}%</span>
                                    </div>
                                    <div className="w-full bg-[#0B0F1A] h-2 rounded-full overflow-hidden border border-gray-800/50">
                                        <div
                                            className={`${item.color} h-full rounded-full transition-all duration-1000`}
                                            style={{ width: `${item.percent}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Templates Section */}
                <div className="space-y-6">
                    <h3 className="text-white font-bold text-lg">Mẫu báo cáo nhanh</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {QUICK_REPORT_TEMPLATES.map((item, i) => {
                            const Icon = TEMPLATE_ICONS[i] || FileText;
                            return (
                                <div key={item.id} className="bg-[#161D2F] rounded-[24px] p-6 border border-gray-800 hover:border-blue-500/50 transition-all group flex flex-col h-full">
                                    <div className={`w-12 h-12 rounded-2xl bg-[#0B0F1A] border border-gray-800 flex items-center justify-center mb-5 ${item.iconColor} group-hover:scale-110 transition-transform`}>
                                        <Icon size={22} />
                                    </div>
                                    <h4 className="text-white font-bold mb-2">{item.title}</h4>
                                    <p className="text-gray-500 text-xs leading-relaxed mb-8 flex-grow">{item.desc}</p>
                                    <button
                                        onClick={() => openReportModal(item)}
                                        className="w-full bg-[#1F2937] hover:bg-blue-600 text-white py-3 rounded-xl text-xs font-bold transition-all"
                                    >
                                        Tạo báo cáo ngay
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Modal Component */}
                <CreateReportModal
                    isOpen={isModalOpen}
                    onClose={closeReportModal}
                    template={selectedTemplate}
                    onSubmit={handleCreateReport}
                />
            </main>
        </div>
    );
}