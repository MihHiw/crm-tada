"use client";
import Sidebar from '@/components/admin/Sidebar';
import { useCalendar } from '@/hooks/calendar/useCalendar';
import {
    AlertCircle, Bell, Calendar as CalendarIcon, CheckCircle,
    ChevronLeft, ChevronRight, MoreHorizontal, Plus, RefreshCw,
    Search, Settings, Video
} from 'lucide-react';
import { useSyncExternalStore } from 'react';

// Helper tránh lỗi Hydration & Cascading Renders
const subscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function CalendarPage() {
    // Triệt tiêu hoàn toàn lỗi "Calling setState synchronously" bằng API mới
    const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const {
        viewMode, setViewMode, currentMonth, changeMonth,
        stats, schedule, todos, handleSync, createEvent
    } = useCalendar();

    if (!isClient) return <div className="min-h-screen bg-[#0B0F1A]" />;

    return (
        <div className="flex min-h-screen bg-[#0B0F1A]">
            <Sidebar adminName="Trần Văn Tú" />

            <main className="flex-1 p-8 space-y-8 overflow-y-auto">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-sm text-gray-500 font-medium">Lịch làm việc</h2>
                        <h1 className="text-2xl font-bold text-white mt-1">Tổng quan lịch trình</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input className="w-full bg-gray-800/40 border border-gray-700/50 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500 transition-all" placeholder="Tìm kiếm khách hàng..." />
                        </div>
                        <button className="p-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-400 hover:text-white transition-all"><Bell size={18} /></button>
                        <button className="p-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-400 hover:text-white transition-all"><Settings size={18} /></button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {stats.map((stat, i) => {
                        const Icons = [Video, AlertCircle, CalendarIcon, CheckCircle];
                        const Icon = Icons[i];
                        return (
                            <div key={i} className="bg-[#161D2F] p-6 rounded-[24px] border border-gray-800/50 flex items-center gap-4 hover:border-gray-700 transition-all">
                                <div className={`p-3 rounded-xl ${stat.color}`}>
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {/* Main Calendar Section */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">
                        <div className="bg-[#161D2F] rounded-[32px] p-8 border border-gray-800 shadow-sm">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-4 text-white">
                                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-800 rounded-xl border border-gray-800 transition-all active:scale-90"><ChevronLeft size={18} /></button>
                                    <h3 className="text-lg font-bold min-w-[150px] text-center capitalize">{currentMonth}</h3>
                                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-800 rounded-xl border border-gray-800 transition-all active:scale-90"><ChevronRight size={18} /></button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#0B0F1A] p-1 rounded-xl flex border border-gray-800">
                                        {['Tháng', 'Tuần', 'Ngày'].map((mode) => (
                                            <button
                                                key={mode}
                                                onClick={() => setViewMode(mode as any)}
                                                className={`px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all ${viewMode === mode ? 'bg-gray-800 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                                            >
                                                {mode}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={handleSync} className="flex items-center gap-2 bg-gray-800 border border-gray-700 px-4 py-2 rounded-xl text-[11px] font-bold text-gray-300 hover:text-white transition-all"><RefreshCw size={14} /> Đồng bộ</button>
                                    <button onClick={createEvent} className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-xl text-[11px] font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all"><Plus size={14} /> Tạo sự kiện</button>
                                </div>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-px bg-gray-800/50 border border-gray-800 rounded-2xl overflow-hidden">
                                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                                    <div key={d} className="bg-[#0B0F1A] p-3 text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">{d}</div>
                                ))}
                                {Array.from({ length: 35 }).map((_, i) => (
                                    <div key={i} className={`bg-[#0B0F1A] min-h-[110px] p-3 border-t border-gray-800/50 hover:bg-white/[0.02] transition-colors cursor-pointer group ${i + 1 === 10 ? 'ring-2 ring-blue-500 ring-inset bg-blue-500/5' : ''}`}>
                                        <span className={`text-xs font-bold ${i + 1 === 10 ? 'text-blue-500' : 'text-gray-600'}`}>{(i % 31) + 1}</span>
                                        {i === 2 && <div className="mt-2 p-1.5 bg-purple-500/10 border-l-2 border-purple-500 text-[9px] text-purple-400 font-medium truncate">Họp chiến lược</div>}
                                        {i === 9 && (
                                            <div className="space-y-1 mt-1">
                                                <div className="p-1 bg-green-500/10 border-l-2 border-green-500 text-[9px] text-green-400 font-medium truncate">Review KH A</div>
                                                <div className="p-1 bg-orange-500/10 border-l-2 border-orange-500 text-[9px] text-orange-400 font-medium truncate">Tư vấn BH</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        <div className="bg-[#161D2F] rounded-[32px] p-6 border border-gray-800 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-white">Lịch trình hôm nay</h3>
                                <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded-md font-bold">08/11/2023</span>
                            </div>
                            <div className="space-y-4">
                                {schedule.map((item, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <span className="text-[11px] text-gray-500 mt-1 font-bold w-10">{item.time}</span>
                                        <div className={`flex-1 p-4 rounded-2xl border-l-4 transition-all hover:translate-x-1 cursor-pointer ${item.color}`}>
                                            <h4 className="text-white text-sm font-bold leading-tight">{item.title}</h4>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="w-5 h-5 rounded-full bg-gray-700/50 border border-white/5" />
                                                <span className="text-[10px] text-gray-400 font-medium">{item.client} • {item.amount || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full p-4 border border-dashed border-gray-700 hover:border-gray-500 rounded-2xl flex items-center justify-center text-[10px] text-gray-500 font-bold uppercase tracking-widest transition-all hover:text-gray-300">+ Trống lịch</button>
                            </div>
                        </div>

                        <div className="bg-[#161D2F] rounded-[32px] p-6 border border-gray-800 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-white">Danh sách cần làm</h3>
                                <button className="text-[10px] text-blue-500 font-bold uppercase hover:text-blue-400 transition-colors">+ Thêm mới</button>
                            </div>
                            <div className="space-y-4">
                                {todos.map((todo) => (
                                    <div key={todo.id} className="flex items-start gap-3 group p-2 rounded-xl hover:bg-white/[0.02] transition-all">
                                        <input type="checkbox" defaultChecked={todo.completed} className="mt-1 w-4 h-4 rounded-md border-gray-700 bg-gray-800 text-blue-500 focus:ring-0 focus:ring-offset-0 cursor-pointer" />
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium transition-all ${todo.completed ? 'text-gray-600 line-through' : 'text-gray-300 group-hover:text-white'}`}>{todo.task}</p>
                                            {todo.deadline && (
                                                <p className={`text-[10px] mt-1 font-bold ${todo.urgent ? 'text-red-500/80' : 'text-gray-600'}`}>{todo.deadline}</p>
                                            )}
                                        </div>
                                        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-800 rounded-lg transition-all"><MoreHorizontal size={14} className="text-gray-500" /></button>
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