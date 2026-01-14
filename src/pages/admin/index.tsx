"use client";

import { Sidebar } from '@/components/admin/Sidebar';
import {
  Calendar,
  Clock,
  DollarSign,
  LucideIcon,
  Search,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

// --- 1. Interfaces ---
interface AnalyticsData {
  name: string;
  revenue: number;
  customers: number;
}

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  subText: string;
  icon: LucideIcon;
  trendColor?: string;
}

// --- 2. Mock Data ---
const data: AnalyticsData[] = [
  { name: 'Jan', revenue: 2400, customers: 240 },
  { name: 'Feb', revenue: 1800, customers: 210 },
  { name: 'Mar', revenue: 9800, customers: 450 },
  { name: 'Apr', revenue: 3908, customers: 300 },
  { name: 'May', revenue: 4800, customers: 320 },
  { name: 'Jun', revenue: 3800, customers: 280 },
  { name: 'Jul', revenue: 4300, customers: 390 },
];

const StatCard = ({ title, value, unit, subText, icon: Icon, trendColor }: StatCardProps) => (
  <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-50 flex justify-between items-center">
    <div>
      <div className="flex flex-col mb-1">
        <span className="text-2xl font-bold text-slate-800">
          {value} {unit && <span className="text-xl font-semibold underline decoration-slate-300">{unit}</span>}
        </span>
        <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mt-1">{title}</span>
      </div>
      <p className={`text-xs font-semibold ${trendColor || 'text-emerald-500'} mt-3`}>
        {subText}
      </p>
    </div>
    <div className="p-4 rounded-full bg-slate-50 text-indigo-500">
      <Icon size={24} strokeWidth={1.5} />
    </div>
  </div>
);

export default function SalesAnalyticsWithSidebar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    // THAY ĐỔI: h-screen và overflow-hidden để cố định layout
    <div className="flex h-screen w-full bg-[#fafbfc] overflow-hidden">

      {/* 1. SIDEBAR: Cố định chiều rộng (w-[260px]) và không cho co lại */}
      <div className="w-[260px] flex-shrink-0 h-full bg-white">
        <Sidebar />
      </div>

      {/* 2. MAIN CONTENT: flex-1 để chiếm phần còn lại, overflow-y-auto để cuộn riêng */}
      <main className="flex-1 h-full overflow-y-auto">
        <div className="max-w-[1400px] mx-auto p-6 md:p-10">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="text-[26px] font-bold text-slate-800 tracking-tight">Thống kê Dịch Vụ</h1>
              <p className="text-sm text-slate-400 font-medium">Quản lý hiệu suất kinh doanh và lịch hẹn.</p>
            </div>

            <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex bg-slate-50 rounded-xl p-1">
                {['Ngày', 'Tháng', 'Năm', 'Tất cả'].map((t) => (
                  <button
                    key={t}
                    className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${t === 'Ngày' ? 'bg-white shadow-sm text-rose-500' : 'text-slate-400'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="h-6 w-px bg-slate-200 mx-1" />
              <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600">
                12/25/2023 <Calendar size={14} className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <StatCard title="Tổng lượt khách" value="4" subText="↗ Theo bộ lọc hiện tại" icon={Users} />
            <StatCard title="Doanh thu ước tính" value="8.800.000" unit="đ" subText="— Không tính đơn đã hủy" icon={DollarSign} />
            <StatCard title="Thời gian TB" value="45" unit="min" subText="↘ Chậm hơn 5p" icon={Clock} trendColor="text-rose-500" />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-slate-50">
              <h3 className="text-lg font-bold text-slate-800 mb-8">Biến động doanh thu</h3>
              <div className="h-[320px] w-full min-h-[320px]">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={15} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                      <Area type="monotone" dataKey="revenue" stroke="#f43f5e" strokeWidth={4} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50">
              <h3 className="text-lg font-bold text-slate-800 mb-8">Lượng khách hàng</h3>
              <div className="h-[320px] w-full min-h-[320px]">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={15} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                      <Bar dataKey="customers" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Search/Bottom Bar */}
          <div className="flex justify-between items-center p-5 bg-white rounded-[24px] border border-slate-50 shadow-sm">
            <span className="font-bold text-slate-700 ml-2">Chi tiết lịch hẹn mới nhất</span>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Tìm khách hàng..."
                className="pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm w-72 outline-none focus:ring-2 focus:ring-rose-100 transition-all"
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}