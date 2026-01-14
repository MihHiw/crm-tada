import { ConsultationRequest } from '@/hooks/consultationData/useConsultationData';
import React, { useState } from 'react';

interface SchedulerModalProps {
    req: ConsultationRequest | null;
    onClose: () => void;
    onConfirm: (data: { date: string; time: string }) => void;
}

const SchedulerModal: React.FC<SchedulerModalProps> = ({ req, onClose, onConfirm }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    if (!req) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
            {/* Main Modal Container */}
            <div className="bg-white w-full max-w-[420px] rounded-[40px] border border-slate-100 p-8 shadow-2xl relative animate-in zoom-in-95 duration-500">

                {/* Nút Đóng */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-8 text-slate-300 hover:text-rose-400 transition-colors text-xl"
                >
                    ✕
                </button>

                {/* Header: Đặt lịch hẹn */}
                <div className="text-left mb-8">
                    <h3 className="text-2xl font-serif italic text-slate-800 mb-6">Đặt lịch hẹn</h3>

                    {/* Box Khách hàng: Gradient nhẹ nhàng phong cách Spa */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 rounded-[24px] p-5 border border-teal-100/50 shadow-sm">
                        <p className="text-[10px] text-teal-600 uppercase font-black tracking-[0.15em] mb-1">Khách hàng</p>
                        <p className="text-lg font-bold text-slate-700 leading-none">{req.name}</p>
                        <div className="w-10 border-b-2 border-teal-400/30 mt-3" />

                        {/* Decor mờ phía sau */}
                        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-teal-200/20 rounded-full blur-2xl" />
                    </div>
                </div>

                {/* Form Logic */}
                <div className="space-y-6">
                    {/* Chọn ngày */}
                    <div className="space-y-2 text-left">
                        <label className="text-[11px] font-bold text-slate-400 flex items-center gap-2 ml-1 uppercase tracking-wider">
                            <span className="p-1 bg-teal-50 rounded-md text-teal-500 text-[10px]">📅</span> Chọn ngày hẹn
                        </label>
                        <input
                            type="date"
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-600 outline-none focus:bg-white focus:border-teal-300 focus:ring-4 focus:ring-teal-50 transition-all cursor-pointer shadow-sm"
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    {/* Chọn giờ: Hiện ra khi đã chọn ngày */}
                    {date && (
                        <div className="space-y-4 text-left animate-in slide-in-from-top-4 duration-500">
                            <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase tracking-wider">Khung giờ khả dụng</label>
                            <div className="grid grid-cols-4 gap-2">
                                {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(t => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setTime(t)}
                                        className={`py-2.5 rounded-xl border text-[11px] font-black transition-all duration-300 ${time === t
                                                ? 'bg-teal-500 border-teal-500 text-white shadow-lg shadow-teal-200 scale-105'
                                                : 'bg-white border-slate-100 text-slate-500 hover:border-teal-200 hover:bg-teal-50/30'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Nút hành động */}
                <div className="mt-10 space-y-3">
                    <button
                        disabled={!date || !time}
                        onClick={() => onConfirm({ date, time })}
                        className="w-full py-4.5 py-4 rounded-[20px] font-black text-[13px] uppercase tracking-widest text-white shadow-xl transition-all duration-500 active:scale-95 disabled:opacity-30 disabled:grayscale
                                   bg-gradient-to-r from-violet-500 via-teal-500 to-emerald-400 bg-[length:200%_auto] hover:bg-right"
                    >
                        Xác nhận đặt lịch
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full py-2 bg-transparent text-slate-300 text-[11px] font-bold hover:text-slate-500 transition-colors uppercase tracking-[0.2em]"
                    >
                        Hủy
                    </button>
                </div>

                <p className="text-[10px] text-slate-300 text-center mt-6 italic">Thanh toán an toàn & bảo mật</p>
            </div>
        </div>
    );
};

export default SchedulerModal;