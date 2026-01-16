"use client";

import { Sidebar } from '@/components/admin/Sidebar';
import GlobalBackground from '@/components/GlobalBackground';
import {
    Calendar,
    Download,
    LucideIcon,
    MoreHorizontal,
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

// --- INTERFACES & DATA ---
interface RevenueChartData { name: string; value: number;[key: string]: string | number; }
interface PieChartData { name: string; value: number; color: string;[key: string]: string | number; }
interface TopStaffData { name: string; revenue: string; percent: number; color: string; }
interface StatCardProps { title: string; value: string; change: string; trend: 'up' | 'down'; icon: LucideIcon; colorClass: string; subtitle: string; }

const REVENUE_DATA: RevenueChartData[] = [
    { name: '01', value: 400 }, { name: '05', value: 300 }, { name: '10', value: 600 },
    { name: '15', value: 800 }, { name: '20', value: 500 }, { name: '25', value: 900 }, { name: '30', value: 750 },
];
const PIE_DATA: PieChartData[] = [
    { name: 'AI Landing Page', value: 45, color: '#10b981' },
    { name: 'Refferal System', value: 30, color: '#3b82f6' },
    { name: 'No Paid Ads Marketing System', value: 25, color: '#a855f7' },
];
const TOP_STAFF: TopStaffData[] = [
    { name: 'Nguyễn Thùy Linh', revenue: '320tr', percent: 90, color: '#10b981' },
    { name: 'Trần Bảo Ngọc', revenue: '285tr', percent: 80, color: '#3b82f6' },
    { name: 'Lê Minh Anh', revenue: '210tr', percent: 60, color: '#a855f7' },
];

// --- COMPONENTS ---
const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon: Icon, colorClass, subtitle }) => (
    <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg hover:bg-slate-800/60 transition-all duration-300 group">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-slate-400 text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
                <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                        {trend === 'up' ? '↗' : '↘'} {change}
                    </span>
                    <span className="text-slate-500 text-[11px] font-medium">{subtitle}</span>
                </div>
            </div>
            <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
            </div>
        </div>
    </div>
);

export default function AnalyticsDashboard() {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    const calculateValue = (percent: number) => {
        const total = 1250;
        const val = (total * percent) / 100;
        return val.toLocaleString('vi-VN') + ' Triệu';
    };

    return (
        <div className="flex h-screen w-full bg-transparent overflow-hidden relative text-slate-200">
            <GlobalBackground />
            <aside className="w-64 flex-shrink-0 bg-slate-900/60 backdrop-blur-xl border-r border-white/5 z-10 shadow-xl">
                <Sidebar />
            </aside>

            <main className="flex-1 overflow-y-auto p-8 custom-scrollbar z-10 relative">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-4">
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight">Tổng quan hiệu suất</h1>
                            <p className="text-slate-400 text-sm mt-1 font-medium">Cập nhật lúc 09:30 AM</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="bg-slate-800/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-sm flex gap-1">
                                {['Tháng này', 'Tuần này', 'Hôm nay'].map((tab) => (
                                    <button key={tab} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'Tháng này' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <button className="flex items-center gap-2 border border-white/10 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-300 bg-slate-800/50 hover:bg-white/10 transition-colors shadow-sm backdrop-blur-md">
                                <Download size={18} /> Xuất PDF
                            </button>
                        </div>
                    </header>

                    {/* Stat Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <StatCard title="Doanh thu" value="1.25 Tỷ" change="+12.5%" trend="up" icon={TrendingUp} colorClass="bg-emerald-500" subtitle="so với tháng trước" />
                        <StatCard title="Lịch hẹn" value="842" change="+5.2%" trend="up" icon={Calendar} colorClass="bg-blue-500" subtitle="so với tháng trước" />
                        <StatCard title="Khách mới" value="156" change="-2.4%" trend="down" icon={UserPlus} colorClass="bg-purple-500" subtitle="so với tháng trước" />
                        <StatCard title="Giữ chân" value="68%" change="+1.8%" trend="up" icon={Target} colorClass="bg-orange-500" subtitle="mục tiêu 70%" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                        {/* Area Chart Section */}
                        <div className="lg:col-span-2 bg-slate-800/40 backdrop-blur-md p-8 rounded-[32px] border border-white/10 shadow-lg">
                            <h3 className="text-xl font-bold text-white mb-8">Biến động doanh thu</h3>
                            <div className="h-[350px] w-full">
                                {isMounted && (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={REVENUE_DATA}>
                                            <defs>
                                                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                            <YAxis hide />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fill="url(#areaGradient)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* Pie Chart Section */}
                        <div className="bg-slate-800/40 backdrop-blur-md p-8 rounded-[32px] border border-white/10 shadow-lg flex flex-col h-full">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Cơ cấu doanh thu</h3>
                                <button className="text-slate-400 hover:text-white transition-colors">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>

                            <div className="relative h-[260px] w-full flex-shrink-0">
                                {isMounted && (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={PIE_DATA}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={85}
                                                outerRadius={115}
                                                paddingAngle={6}
                                                dataKey="value"
                                                stroke="none"
                                                cornerRadius={8}
                                            >
                                                {PIE_DATA.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                        className="stroke-slate-900 stroke-2 outline-none"
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                                    backdropFilter: 'blur(12px)',
                                                    borderRadius: '16px',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                                    padding: '12px 16px'
                                                }}
                                                itemStyle={{ color: '#fff', fontWeight: 600 }}
                                                // 👇 SỬA LỖI TS Ở ĐÂY: Dùng Union Type và kiểm tra giá trị
                                                formatter={(value: number | string | (number | string)[] | undefined) => {
                                                    if (typeof value === 'number') return [`${value}%`, 'Tỷ trọng'];
                                                    return [String(value || ''), 'Tỷ trọng'];
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}

                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <div className="flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-full w-32 h-32 border border-white/5 shadow-inner">
                                        <span className="text-3xl font-black text-white tracking-tighter drop-shadow-lg">100%</span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Tổng</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-col gap-3 overflow-y-auto custom-scrollbar flex-1 pr-1">
                                {PIE_DATA.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 group cursor-default"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-2.5 h-2.5">
                                                <span className="absolute inset-0 rounded-full opacity-70 blur-[3px] group-hover:opacity-100 transition-opacity" style={{ backgroundColor: item.color }}></span>
                                                <span className="absolute inset-0 rounded-full" style={{ backgroundColor: item.color }}></span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm text-slate-200 font-semibold group-hover:text-white transition-colors">
                                                    {item.name}
                                                </span>
                                                <span className="text-[10px] text-slate-500 font-medium">
                                                    {calculateValue(item.value)}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-white bg-white/10 px-2 py-1 rounded-lg min-w-[3.5rem] text-center">
                                            {item.value}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Top Staff Table */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-slate-800/40 backdrop-blur-md p-8 rounded-[32px] border border-white/10 shadow-lg">
                            <h3 className="text-xl font-bold text-white mb-10">Top nhân viên xuất sắc</h3>
                            <div className="space-y-8">
                                {TOP_STAFF.map((staff, idx) => (
                                    <div key={staff.name} className="group">
                                        <div className="flex justify-between items-end mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center text-xs font-bold text-slate-400">
                                                    #{idx + 1}
                                                </div>
                                                <span className="text-sm font-bold text-slate-300 group-hover:text-blue-400 transition-colors">{staff.name}</span>
                                            </div>
                                            <span className="text-sm font-black text-white">{staff.revenue}</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-1000 group-hover:brightness-110" style={{ width: `${staff.percent}%`, backgroundColor: staff.color }} />
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