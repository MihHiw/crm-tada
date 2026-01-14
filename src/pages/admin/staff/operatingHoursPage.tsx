"use client";

import { Sidebar } from '@/components/admin/Sidebar';
// Đảm bảo import đúng đường dẫn hook của bạn
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

    // --- Logic Toggle Mở/Đóng cửa ---
    const handleToggleOpen = (index: number) => {
        const newSchedule = [...schedule];
        newSchedule[index].isOpen = !newSchedule[index].isOpen;
        // Nếu bật mở lại mà chưa có shift nào, tự động thêm 1 shift mặc định
        if (newSchedule[index].isOpen && newSchedule[index].shifts.length === 0) {
            newSchedule[index].shifts.push({ start: '09:00', end: '17:00' });
        }
        updateLocalSchedule(newSchedule);
    };

    // --- Logic Thay đổi giờ (Start/End) trong 1 shift cụ thể ---
    const handleTimeChange = (dayIndex: number, shiftIndex: number, field: 'start' | 'end', value: string) => {
        const newSchedule = [...schedule];
        // Cập nhật giá trị cho shift cụ thể
        newSchedule[dayIndex].shifts[shiftIndex][field] = value;
        updateLocalSchedule(newSchedule);
    };

    // --- Logic Thêm khung giờ mới ---
    const addShift = (dayIndex: number) => {
        const newSchedule = [...schedule];
        // Thêm một khung giờ mặc định
        newSchedule[dayIndex].shifts.push({ start: '13:00', end: '17:00' });
        updateLocalSchedule(newSchedule);
    };

    // --- Logic Xóa khung giờ ---
    const removeShift = (dayIndex: number, shiftIndex: number) => {
        const newSchedule = [...schedule];
        newSchedule[dayIndex].shifts.splice(shiftIndex, 1);
        updateLocalSchedule(newSchedule);
    };

    // --- Logic Copy Thứ 2 cho cả tuần ---
    const applyMondayToAll = () => {
        if (!confirm('Áp dụng cấu hình Thứ 2 cho toàn bộ tuần?')) return;
        if (schedule.length === 0) return;

        const monday = schedule[0];
        const newSchedule = schedule.map((day) => ({
            ...day,
            isOpen: monday.isOpen,
            // Deep copy mảng shifts để tránh tham chiếu bộ nhớ chung
            shifts: monday.shifts.map(shift => ({ ...shift })),
        }));
        updateLocalSchedule(newSchedule);
    };

    if (isLoading) {
        return (
            <div className="flex h-screen w-full bg-gray-50 items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
            <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white hidden md:block z-10">
                <Sidebar />
            </aside>

            <main className="flex-1 flex flex-col min-w-0 h-full">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 z-10 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <Store className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Cấu hình giờ mở cửa</h1>
                            <p className="text-sm text-gray-500">Quản lý các ca làm việc trong ngày</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors">
                            <History className="w-4 h-4" />
                            Lịch sử
                        </button>
                        <button
                            onClick={saveChanges}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
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
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="w-full h-full flex flex-col gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full md:h-auto">

                            {/* Toolbar */}
                            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 rounded-t-xl">
                                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                    <Clock className="w-4 h-4 text-indigo-500" />
                                    <span>Múi giờ hệ thống: <span className="text-gray-900 font-bold">GMT+7 (Asia/Ho_Chi_Minh)</span></span>
                                </div>
                                <button
                                    onClick={applyMondayToAll}
                                    className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2 px-3 py-1.5 rounded hover:bg-indigo-50 transition-colors"
                                >
                                    <Copy className="w-4 h-4" />
                                    Sao chép Thứ 2 cho cả tuần
                                </button>
                            </div>

                            {/* Table Grid Header */}
                            <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                <div className="col-span-3">Ngày & Trạng thái</div>
                                <div className="col-span-7 text-center">Các khung giờ hoạt động (Shifts)</div>
                                <div className="col-span-2 text-right">Tổng quan</div>
                            </div>

                            {/* Table Grid Body */}
                            <div className="flex-1 divide-y divide-gray-100">
                                {schedule.map((day, dayIndex) => (
                                    <div
                                        key={day.id}
                                        // Sử dụng items-start thay vì items-center để hỗ trợ nội dung dài
                                        className={`group grid grid-cols-1 md:grid-cols-12 gap-4 items-start px-6 md:px-8 py-6 transition-all duration-200 ${!day.isOpen ? 'bg-gray-50/50' : 'hover:bg-indigo-50/5'}`}
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
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
                                            </label>

                                            <div className="flex flex-col">
                                                <span className={`text-base font-semibold ${day.isOpen ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {day.label}
                                                </span>
                                                <span className="text-xs text-gray-400 md:hidden">
                                                    {day.isOpen ? 'Đang mở cửa' : 'Đóng cửa'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Cột 2: Time Inputs - Hiển thị danh sách Shifts */}
                                        <div className="md:col-span-7">
                                            {day.isOpen ? (
                                                <div className="flex flex-col gap-3">
                                                    {/* Map qua từng shift */}
                                                    {day.shifts.map((shift, shiftIndex) => (
                                                        <div key={shiftIndex} className="flex flex-col sm:flex-row items-center gap-3 animate-fadeIn">
                                                            {/* Start Time */}
                                                            <div className="relative w-full sm:w-auto flex-1">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <span className="text-gray-400 text-xs font-medium">Từ</span>
                                                                </div>
                                                                <input
                                                                    type="time"
                                                                    value={shift.start}
                                                                    onChange={(e) => handleTimeChange(dayIndex, shiftIndex, 'start', e.target.value)}
                                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow bg-white text-gray-700 font-medium"
                                                                />
                                                            </div>

                                                            <span className="text-gray-300 font-light hidden sm:block">-</span>

                                                            {/* End Time */}
                                                            <div className="relative w-full sm:w-auto flex-1">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <span className="text-gray-400 text-xs font-medium">Đến</span>
                                                                </div>
                                                                <input
                                                                    type="time"
                                                                    value={shift.end}
                                                                    onChange={(e) => handleTimeChange(dayIndex, shiftIndex, 'end', e.target.value)}
                                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow bg-white text-gray-700 font-medium"
                                                                />
                                                            </div>

                                                            {/* Delete Shift Button */}
                                                            <button
                                                                onClick={() => removeShift(dayIndex, shiftIndex)}
                                                                title="Xóa khung giờ này"
                                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}

                                                    {/* Add Shift Button */}
                                                    <button
                                                        onClick={() => addShift(dayIndex)}
                                                        className="flex items-center justify-center gap-2 py-2 px-4 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all w-full sm:w-auto mt-1"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Thêm khung giờ
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="w-full py-3 bg-gray-100 rounded-lg border border-dashed border-gray-300 text-center">
                                                    <span className="text-sm text-gray-500 italic flex items-center justify-center gap-2">
                                                        <CalendarDays className="w-4 h-4" />
                                                        Ngày nghỉ / Không nhận khách
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Cột 3: Status Badge */}
                                        <div className="md:col-span-2 flex justify-end pt-2">
                                            {day.isOpen ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                                                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                                                    {day.shifts.length} Ca làm
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">
                                                    Đã đóng
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer Warning */}
                            <div className="bg-orange-50 p-4 border-t border-orange-100 rounded-b-xl flex gap-3">
                                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-orange-800">
                                    <span className="font-bold block mb-1">Cảnh báo hệ thống</span>
                                    Hệ thống hiện hỗ trợ nhiều khung giờ trong ngày (VD: Sáng/Chiều). Hãy đảm bảo các khung giờ không bị trùng lặp nhau để tránh lỗi đặt lịch.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}