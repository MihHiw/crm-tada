"use client";

import { Sidebar } from '@/components/admin/Sidebar';
import GlobalBackground from '@/components/GlobalBackground';
import { useOperatingHours } from '@/hooks/operatingHours/useOperatingHours';
import {
    AlertCircle,
    CalendarDays,
    Clock,
    Copy,
    History,
    Plus,
    Save,
    Store,
    Trash2
} from 'lucide-react';

export default function OperatingHoursPage() {
    const {
        schedule,
        isLoading,
        isSaving,
        updateLocalSchedule,
        saveChanges
    } = useOperatingHours();

    const handleToggleOpen = (index: number) => {
        const newSchedule = [...schedule];
        newSchedule[index].isOpen = !newSchedule[index].isOpen;
        if (newSchedule[index].isOpen && newSchedule[index].shifts.length === 0) {
            newSchedule[index].shifts.push({ start: '09:00', end: '17:00' });
        }
        updateLocalSchedule(newSchedule);
    };

    const handleTimeChange = (dayIndex: number, shiftIndex: number, field: 'start' | 'end', value: string) => {
        const newSchedule = [...schedule];
        newSchedule[dayIndex].shifts[shiftIndex][field] = value;
        updateLocalSchedule(newSchedule);
    };

    const addShift = (dayIndex: number) => {
        const newSchedule = [...schedule];
        newSchedule[dayIndex].shifts.push({ start: '13:00', end: '17:00' });
        updateLocalSchedule(newSchedule);
    };

    const removeShift = (dayIndex: number, shiftIndex: number) => {
        const newSchedule = [...schedule];
        newSchedule[dayIndex].shifts.splice(shiftIndex, 1);
        updateLocalSchedule(newSchedule);
    };

    const applyMondayToAll = () => {
        if (!confirm('Áp dụng cấu hình Thứ 2 cho toàn bộ tuần?')) return;
        if (schedule.length === 0) return;

        const monday = schedule[0];
        const newSchedule = schedule.map((day) => ({
            ...day,
            isOpen: monday.isOpen,
            shifts: monday.shifts.map(shift => ({ ...shift })),
        }));
        updateLocalSchedule(newSchedule);
    };

    if (isLoading) {
        return (
            <div className="flex h-screen w-full bg-slate-900 items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white/60 font-medium">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        // ROOT: Dark Mode + Glass
        <div className="flex h-screen w-full overflow-hidden font-sans text-white">
            <GlobalBackground />

            {/* Sidebar Glass */}
            <div className="w-[260px] flex-shrink-0 h-full border-r border-white/10 bg-slate-900/60 backdrop-blur-xl z-20">
                <Sidebar />
            </div>

            {/* FIX: Cấu trúc Main để hỗ trợ cuộn và căn trái */}
            <main className="flex-1 h-full overflow-y-auto relative z-10 scrollbar-hide">

                {/* FIX: Container căn trái (mr-auto) và giảm padding (p-6) */}
                <div className="w-full max-w-[1600px] mr-auto p-6 space-y-8">

                    {/* Header Section - Đưa vào trong luồng cuộn */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300 border border-indigo-500/30">
                                <Store className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white tracking-tight">Cấu hình giờ mở cửa</h1>
                                <p className="text-sm text-white/60 font-medium">Quản lý các ca làm việc trong ngày.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-white/80 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 font-medium text-sm transition-colors">
                                <History className="w-4 h-4" />
                                Lịch sử
                            </button>
                            <button
                                onClick={saveChanges}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-medium shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Đang lưu...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Lưu thay đổi
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Main Content Container (Glass) */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/10 flex flex-col overflow-hidden">

                        {/* Toolbar */}
                        <div className="px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-black/20">
                            <div className="flex items-center gap-2 text-sm text-white/60 font-medium">
                                <Clock className="w-4 h-4 text-emerald-400" />
                                <span>Múi giờ hệ thống: <span className="text-white font-bold">GMT+7 (Asia/Ho_Chi_Minh)</span></span>
                            </div>
                            <button
                                onClick={applyMondayToAll}
                                className="text-sm text-indigo-300 hover:text-white font-semibold flex items-center gap-2 px-3 py-1.5 rounded hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
                            >
                                <Copy className="w-4 h-4" />
                                Sao chép Thứ 2 cho cả tuần
                            </button>
                        </div>

                        {/* Table Grid Header */}
                        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-3 bg-white/5 text-xs font-bold text-white/40 uppercase tracking-widest border-b border-white/10">
                            <div className="col-span-3">Ngày & Trạng thái</div>
                            <div className="col-span-7 text-center">Các khung giờ hoạt động (Shifts)</div>
                            <div className="col-span-2 text-right">Tổng quan</div>
                        </div>

                        {/* Table Grid Body */}
                        <div className="divide-y divide-white/5">
                            {schedule.map((day, dayIndex) => (
                                <div
                                    key={day.id}
                                    className={`group grid grid-cols-1 md:grid-cols-12 gap-4 items-start px-6 md:px-8 py-6 transition-all duration-200 ${!day.isOpen ? 'bg-black/20 opacity-60' : 'hover:bg-white/5'}`}
                                >
                                    {/* Cột 1: Toggle & Label */}
                                    <div className="md:col-span-3 flex items-center gap-4 pt-2">
                                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={day.isOpen}
                                                onChange={() => handleToggleOpen(dayIndex)}
                                            />
                                            <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
                                        </label>

                                        <div className="flex flex-col">
                                            <span className={`text-base font-bold ${day.isOpen ? 'text-white' : 'text-white/40'}`}>
                                                {day.label}
                                            </span>
                                            <span className="text-xs text-white/40 md:hidden">
                                                {day.isOpen ? 'Đang mở cửa' : 'Đóng cửa'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Cột 2: Time Inputs */}
                                    <div className="md:col-span-7">
                                        {day.isOpen ? (
                                            <div className="flex flex-col gap-3">
                                                {day.shifts.map((shift, shiftIndex) => (
                                                    <div key={shiftIndex} className="flex flex-col sm:flex-row items-center gap-3 animate-fadeIn">
                                                        {/* Start Time */}
                                                        <div className="relative w-full sm:w-auto flex-1 group/input">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Từ</span>
                                                            </div>
                                                            <input
                                                                type="time"
                                                                value={shift.start}
                                                                onChange={(e) => handleTimeChange(dayIndex, shiftIndex, 'start', e.target.value)}
                                                                className="w-full pl-10 pr-3 py-2.5 bg-black/30 border border-white/10 rounded-xl text-sm text-white font-bold outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all cursor-pointer"
                                                            />
                                                        </div>

                                                        <span className="text-white/20 font-light hidden sm:block">—</span>

                                                        {/* End Time */}
                                                        <div className="relative w-full sm:w-auto flex-1 group/input">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Đến</span>
                                                            </div>
                                                            <input
                                                                type="time"
                                                                value={shift.end}
                                                                onChange={(e) => handleTimeChange(dayIndex, shiftIndex, 'end', e.target.value)}
                                                                className="w-full pl-10 pr-3 py-2.5 bg-black/30 border border-white/10 rounded-xl text-sm text-white font-bold outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all cursor-pointer"
                                                            />
                                                        </div>

                                                        {/* Delete Button */}
                                                        <button
                                                            onClick={() => removeShift(dayIndex, shiftIndex)}
                                                            className="p-2.5 text-white/30 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}

                                                {/* Add Shift Button */}
                                                <button
                                                    onClick={() => addShift(dayIndex)}
                                                    className="flex items-center justify-center gap-2 py-2 px-4 border border-dashed border-white/20 rounded-xl text-xs font-bold text-white/40 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all w-full sm:w-auto mt-1 uppercase tracking-wider"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Thêm khung giờ
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-full py-3 bg-white/5 rounded-xl border border-dashed border-white/10 text-center">
                                                <span className="text-xs text-white/30 font-medium italic flex items-center justify-center gap-2">
                                                    <CalendarDays className="w-4 h-4" />
                                                    Ngày nghỉ / Không nhận khách
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Cột 3: Status Badge */}
                                    <div className="md:col-span-2 flex justify-end pt-2">
                                        {day.isOpen ? (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wide">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                                                {day.shifts.length} Ca làm
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white/40 border border-white/10 uppercase tracking-wide">
                                                Đã đóng
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer Warning */}
                        <div className="bg-amber-500/10 p-4 border-t border-amber-500/20 rounded-b-[2rem] flex gap-3 backdrop-blur-md">
                            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-amber-200/80 font-medium leading-relaxed">
                                <span className="font-bold text-amber-300 block mb-0.5 uppercase tracking-wide">Lưu ý hệ thống</span>
                                Hệ thống hỗ trợ nhiều khung giờ (ca gãy). Hãy đảm bảo các khung giờ không bị trùng lặp nhau để tránh lỗi đặt lịch.
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}</style>
        </div>
    );
}