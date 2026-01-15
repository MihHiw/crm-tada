"use client";

import { Sidebar } from '@/components/admin/Sidebar';
import GlobalBackground from '@/components/GlobalBackground';
import {
  Calendar,
  Clock,
  DollarSign,
  LucideIcon,
  MoreHorizontal,
  Search,
  Users
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
  trend: 'up' | 'down' | 'neutral';
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

// --- 3. Custom Components ---

const StatCard = ({ title, value, unit, subText, icon: Icon, trend }: StatCardProps) => {
  // Xác định màu sắc dựa trên xu hướng
  const trendColor = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-slate-400';
  const iconBg = trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' : trend === 'down' ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-400';

  return (
    <div className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[24px] shadow-xl hover:bg-white/10 transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white tracking-tight">
              {value}
            </span>
            {unit && <span className="text-lg font-medium text-slate-400">{unit}</span>}
          </div>
          <p className={`text-xs font-medium ${trendColor} mt-3 flex items-center gap-1`}>
            {subText}
          </p>
        </div>
        <div className={`p-3 rounded-2xl ${iconBg} shadow-inner`}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
      </div>
      {/* Hiệu ứng glow nhẹ khi hover */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
    </div>
  );
};

export default function SalesAnalyticsWithSidebar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans text-slate-200">
      {/* Background toàn cục */}
      <GlobalBackground />

      {/* LƯU Ý: Sidebar container được làm trong suốt. 
         Nếu component <Sidebar /> của bạn có background cứng (bg-white), 
         hãy vào file Sidebar đó sửa thành bg-transparent hoặc bg-slate-900/50 
      */}
      <div className="w-[280px] flex-shrink-0 h-full border-r border-white/5 bg-slate-900/60 backdrop-blur-xl z-20">
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 h-full overflow-y-auto relative z-10 scrollbar-hide">
        <div className="max-w-[1600px] mx-auto p-6 md:p-10">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Thống kê Dịch Vụ</h1>
              <p className="text-slate-400 font-medium text-sm">Quản lý hiệu suất kinh doanh và lịch hẹn hôm nay.</p>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-1.5 rounded-2xl backdrop-blur-md">
              <div className="flex bg-black/20 rounded-xl p-1">
                {['Ngày', 'Tháng', 'Năm'].map((t) => (
                  <button
                    key={t}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${t === 'Ngày'
                        ? 'bg-indigo-500 shadow-lg shadow-indigo-500/30 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="h-6 w-px bg-white/10 mx-1" />
              <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors">
                25/12/2023 <Calendar size={14} className="text-indigo-400" />
              </button>
            </div>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Tổng lượt khách"
              value="4"
              subText="↗ Tăng 12% so với hôm qua"
              icon={Users}
              trend="up"
            />
            <StatCard
              title="Doanh thu ước tính"
              value="8.8M"
              unit="đ"
              subText="— Không tính đơn đã hủy"
              icon={DollarSign}
              trend="neutral"
            />
            <StatCard
              title="Thời gian TB"
              value="45"
              unit="min"
              subText="↘ Chậm hơn 5p so với mục tiêu"
              icon={Clock}
              trend="down"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            {/* Area Chart - Doanh thu */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 shadow-xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-white">Biến động doanh thu</h3>
                <button className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="h-[320px] w-full min-h-[320px]">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        dy={15}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          borderColor: 'rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          color: '#fff',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                        }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#f43f5e"
                        strokeWidth={3}
                        fill="url(#colorRev)"
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Bar Chart - Khách hàng */}
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-8">Lượng khách hàng</h3>
              <div className="h-[320px] w-full min-h-[320px]">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        dy={15}
                      />
                      <YAxis hide />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 8 }}
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          borderColor: 'rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          color: '#fff'
                        }}
                      />
                      <Bar
                        dataKey="customers"
                        fill="#6366f1"
                        radius={[6, 6, 6, 6]}
                        barSize={16}
                        // Hiệu ứng gradient cho cột
                        className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Search/Bottom Bar - Glass Style */}
          <div className="flex justify-between items-center p-4 bg-white/5 backdrop-blur-xl rounded-[24px] border border-white/10 shadow-lg">
            <span className="font-bold text-slate-300 ml-2 text-sm">Chi tiết lịch hẹn mới nhất</span>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Tìm khách hàng..."
                className="pl-11 pr-5 py-2.5 bg-black/20 border border-white/5 rounded-xl text-sm w-64 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}