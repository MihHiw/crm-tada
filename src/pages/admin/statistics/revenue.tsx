"use client";

import { Sidebar } from '@/components/admin/Sidebar';
import {
    Calendar,
    Download,
    LucideIcon,
    Target,
    TrendingUp,
    UserPlus
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

// --- 1. ĐỊNH NGHĨA INTERFACES (KHÔNG DÙNG ANY) ---
interface RevenueChartData {
    name: string;
    value: number;
    [key: string]: string | number;
}

interface PieChartData {
    name: string;
    value: number;
    color: string;
    [key: string]: string | number;
}

interface TopStaffData {
    name: string;
    revenue: string;
    percent: number;
    color: string;
}

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: LucideIcon;
    colorClass: string;
    subtitle: string;
}

// --- 2. DỮ LIỆU MẪU ---
const REVENUE_DATA: RevenueChartData[] = [
    { name: '01', value: 400 },
    { name: '05', value: 300 },
    { name: '10', value: 600 },
    { name: '15', value: 800 },
    { name: '20', value: 500 },
    { name: '25', value: 900 },
    { name: '30', value: 750 },
];

const PIE_DATA: PieChartData[] = [
    { name: 'Dịch vụ Spa', value: 45, color: '#10b981' },
    { name: 'Mỹ phẩm', value: 30, color: '#059669' },
    { name: 'Gói liệu trình', value: 25, color: '#a7f3d0' },
];

const TOP_STAFF: TopStaffData[] = [
    { name: 'Nguyễn Thùy Linh', revenue: '320tr', percent: 90, color: '#10b981' },
    { name: 'Trần Bảo Ngọc', revenue: '285tr', percent: 80, color: '#10b981' },
    { name: 'Lê Minh Anh', revenue: '210tr', percent: 60, color: '#34d399' },
];

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon: Icon, colorClass, subtitle }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-slate-500 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
                <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                        {trend === 'up' ? '↗' : '↘'} {change}
                    </span>
                    <span className="text-slate-400 text-[11px] font-medium">{subtitle}</span>
                </div>
            </div>
            <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10`}>
                <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
            </div>
        </div>
    </div>
);

export default function AnalyticsDashboard() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        // FIX TRÀN: Cố định h-screen và chia flex rõ ràng
        <div className="flex h-screen w-full bg-[#F8FAFB] overflow-hidden">

            {/* Sidebar chiếm diện tích cố định */}
            <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-100">
                <Sidebar />
            </aside>

            {/* Dashboard chiếm phần còn lại và có thanh cuộn riêng */}
            <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-4">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Tổng quan hiệu suất</h1>
                            <p className="text-slate-400 text-sm mt-1 font-semibold">Cập nhật lúc 09:30 AM</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm flex gap-1">
                                {['Tháng này', 'Tuần này', 'Hôm nay'].map((tab) => (
                                    <button key={tab} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'Tháng này' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <button className="flex items-center gap-2 border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-white">
                                <Download size={18} /> Xuất PDF
                            </button>
                        </div>
                    </header>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <StatCard title="Doanh thu" value="1.25 Tỷ" change="+12.5%" trend="up" icon={TrendingUp} colorClass="bg-emerald-500" subtitle="so với tháng trước" />
                        <StatCard title="Lịch hẹn" value="842" change="+5.2%" trend="up" icon={Calendar} colorClass="bg-blue-500" subtitle="so với tháng trước" />
                        <StatCard title="Khách mới" value="156" change="-2.4%" trend="down" icon={UserPlus} colorClass="bg-purple-500" subtitle="so với tháng trước" />
                        <StatCard title="Giữ chân" value="68%" change="+1.8%" trend="up" icon={Target} colorClass="bg-orange-500" subtitle="mục tiêu 70%" />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-800 mb-8">Biến động doanh thu</h3>
                            <div className="h-[350px] w-full">
                                {isMounted && (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={REVENUE_DATA}>
                                            <defs>
                                                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                            <YAxis hide />
                                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                                            <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={4} fill="url(#areaGradient)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm flex flex-col">
                            <h3 className="text-xl font-bold text-slate-800 mb-8">Cơ cấu doanh thu</h3>
                            <div className="flex-1 relative min-h-[250px]">
                                {isMounted && (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={PIE_DATA} innerRadius={75} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">
                                                {PIE_DATA.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-4xl font-black text-slate-900">100%</span>
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Tổng</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Tables */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-800 mb-10">Hiệu suất nhân viên</h3>
                            <div className="space-y-10">
                                {TOP_STAFF.map((staff) => (
                                    <div key={staff.name}>
                                        <div className="flex justify-between items-end mb-3">
                                            <span className="text-md font-bold text-slate-700">{staff.name}</span>
                                            <span className="text-md font-black text-slate-900">{staff.revenue}</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${staff.percent}%`, backgroundColor: staff.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}