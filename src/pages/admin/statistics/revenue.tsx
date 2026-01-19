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
    { name: 'Referral System', value: 30, color: '#3b82f6' },
    { name: 'Marketing System', value: 25, color: '#a855f7' },
];
const TOP_STAFF: TopStaffData[] = [
    { name: 'Nguyễn Thùy Linh', revenue: '320tr', percent: 90, color: '#10b981' },
    { name: 'Trần Bảo Ngọc', revenue: '285tr', percent: 80, color: '#3b82f6' },
    { name: 'Lê Minh Anh', revenue: '210tr', percent: 60, color: '#a855f7' },
];

// --- COMPONENTS ---
const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon: Icon, colorClass, subtitle }) => (
    <div className="bg-[#1e293b]/50 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/5 shadow-2xl hover:bg-white/[0.05] transition-all duration-500 group relative overflow-hidden">
        <div className="flex justify-between items-center relative z-10">
            <div>
                <p className="text-slate-400 text-[11px] font-black  tracking-widest opacity-60">{title}</p>
                <h3 className="text-3xl font-black text-white mt-2 tracking-tight">{value}</h3>
                <div className="flex items-center gap-2 mt-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                        {trend === 'up' ? '↗' : '↘'} {change}
                    </span>
                    <span className="text-slate-500 text-[10px] font-bold  opacity-50">{subtitle}</span>
                </div>
            </div>
            <div className={`p-4 rounded-[1.5rem] bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={28} className={colorClass.replace('bg-', 'text-')} />
            </div>
        </div>
        <div className={`absolute -right-4 -top-4 w-24 h-24 blur-[50px] opacity-20 rounded-full ${colorClass}`}></div>
    </div>
);

export default function AnalyticsDashboard() {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    const calculateValue = (percent: number) => {
        const total = 1.25; // Tỷ
        const val = (total * percent) / 100;
        return val.toFixed(2) + ' Tỷ';
    };

    return (
        <div className="flex h-screen w-full bg-transparent overflow-hidden relative text-slate-200">
            <GlobalBackground />

            <aside className="w-[260px] flex-shrink-0 bg-slate-950/20 backdrop-blur-3xl border-r border-white/10 z-50 shadow-2xl">
                <Sidebar />
            </aside>

            <main className="flex-1 overflow-y-auto p-6 custom-scrollbar z-10 relative">

                <div className="max-w-7xl mr-auto">

                    {/* Header */}
                    <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Tổng quan hiệu suất</h1>
                            <p className="text-white/60 text-sm font-medium">Cập nhật lúc 09:30 AM</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-xl flex gap-1">
                                {['Tháng này', 'Tuần này', 'Hôm nay'].map((tab) => (
                                    <button key={tab} className={`px-6 py-2.5 rounded-xl text-xs font-black  tracking-widest transition-all ${tab === 'Tháng này' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <button className="flex items-center gap-2 border border-white/10 px-6 py-3 rounded-2xl text-xs font-black  tracking-widest text-white bg-white/5 hover:bg-white/10 transition-all shadow-xl backdrop-blur-md">
                                <Download size={18} /> Xuất báo cáo
                            </button>
                        </div>
                    </header>

                    {/* Stat Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <StatCard title="Doanh thu" value="1.25 Tỷ" change="+12.5%" trend="up" icon={TrendingUp} colorClass="bg-emerald-500" subtitle="vs tháng trước" />
                        <StatCard title="Lịch hẹn" value="842" change="+5.2%" trend="up" icon={Calendar} colorClass="bg-blue-500" subtitle="vs tháng trước" />
                        <StatCard title="Khách mới" value="156" change="-2.4%" trend="down" icon={UserPlus} colorClass="bg-purple-500" subtitle="vs tháng trước" />
                        <StatCard title="Giữ chân" value="68%" change="+1.8%" trend="up" icon={Target} colorClass="bg-orange-500" subtitle="mục tiêu 70%" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                        {/* Area Chart Section */}
                        <div className="lg:col-span-2 bg-[#1e293b]/50 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/5 shadow-2xl">
                            <h3 className="text-xl font-black text-white  tracking-tight mb-12">Biến động doanh thu</h3>
                            <div className="h-[400px] w-full">
                                {isMounted && (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={REVENUE_DATA}>
                                            <defs>
                                                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} dy={20} />
                                            <YAxis hide domain={['auto', 'auto']} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(12px)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}
                                            />
                                            <Area type="basis" dataKey="value" stroke="#10b981" strokeWidth={4} fill="url(#areaGradient)" animationDuration={2000} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* Pie Chart Section */}
                        <div className="bg-[#1e293b]/50 backdrop-blur-xl p-8 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-black text-white  tracking-tight">Cơ cấu doanh thu</h3>
                                <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><MoreHorizontal size={20} /></button>
                            </div>

                            <div className="relative h-[300px] w-full flex-shrink-0">
                                {isMounted && (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={PIE_DATA}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={90}
                                                outerRadius={125}
                                                paddingAngle={0}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {PIE_DATA.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                        stroke="none"
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(12px)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                                formatter={(value: number | string | undefined) => {
                                                    const numValue = typeof value === 'string' ? parseFloat(value) : value;
                                                    return [`${numValue ?? 0}%`, 'Tỷ trọng'];
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}

                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <div className="text-center">
                                        <span className="block text-3xl text-white tracking-normal font-bold">100%</span>
                                        <span className="text-[10px] text-white font-black tracking-[0.3em] mt-1 opacity-70">Tổng cộng</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
                                {PIE_DATA.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ backgroundColor: item.color }}></div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{item.name}</span>
                                                <span className="text-[10px] text-slate-500 font-bold">{calculateValue(item.value)}</span>
                                            </div>
                                        </div>
                                        <span className="text-sm font-black text-white">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Top Staff Table */}
                    <div className="bg-[#1e293b]/50 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/5 shadow-2xl max-w-2xl">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-10">Top nhân viên xuất sắc</h3>
                        <div className="space-y-8">
                            {TOP_STAFF.map((staff, idx) => (
                                <div key={staff.name} className="group">
                                    <div className="flex justify-between items-end mb-3">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-emerald-400">
                                                #{idx + 1}
                                            </div>
                                            <span className="text-base font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">{staff.name}</span>
                                        </div>
                                        <span className="text-lg font-black text-white">{staff.revenue}</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                            style={{ width: `${staff.percent}%`, backgroundColor: staff.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}