"use client";
import { ConsultationRequest, useConsultationData } from '@/hooks/consultationData/useConsultationData';
import { Clock, History, Mail, Phone, Save, Tag, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface Props {
    req: ConsultationRequest | null;
    onClose: () => void;
}

const CustomerDetailModal: React.FC<Props> = ({ req: initialReq, onClose }) => {
    const { data, updateDetails } = useConsultationData();
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const currentReq = data.find(item => item.id === initialReq?.id);
    const requestId = currentReq?.id;
    const requestNotes = currentReq?.notes;

    useEffect(() => {
        if (requestId) {
            setNote(requestNotes || '');
        }
    }, [requestId, requestNotes]);

    if (!initialReq || !currentReq) return null;

    const handleSaveNote = async () => {
        if (note === currentReq.notes) return;
        setIsSaving(true);
        const success = await updateDetails(currentReq.id, { notes: note });
        setIsSaving(false);

        if (success) {
            Swal.fire({
                icon: 'success',
                title: 'Đã lưu ghi chú',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                customClass: { popup: 'rounded-xl' }
            });
        }
    };

    // Hàm bổ trợ để lấy màu sắc cho từng loại trạng thái trong nhật ký
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'SUCCESS': return 'bg-green-100 text-green-700 border-green-200';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            case 'CONTACTED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'APPOINTMENT': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[85vh] max-h-[800px] animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-2xl bg-[#A33446] flex items-center justify-center text-white shadow-lg shadow-[#A33446]/20">
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 uppercase italic leading-none">{currentReq.customer_name}</h3>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Hồ sơ khách hàng #{currentReq.id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 transition-all shadow-sm">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* CỘT TRÁI: Thông tin khách hàng */}
                    <div className="w-full md:w-[58%] overflow-y-auto p-8 border-r border-slate-100 custom-scrollbar flex-shrink-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-left">
                            <div className="space-y-4">
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-[#00d084] pl-3">Thông tin liên hệ</h4>
                                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                                    <div className="flex items-center gap-3 text-slate-600 text-sm font-medium"><Phone size={14} className="text-[#00d084]" /> {currentReq.customer_phone}</div>
                                    <div className="flex items-center gap-3 text-slate-600 text-sm font-medium"><Mail size={14} className="text-[#00d084]" /> {currentReq.customer_email || 'N/A'}</div>
                                    <div className="flex items-center gap-3 text-slate-600 text-sm font-medium"><Tag size={14} className="text-[#00d084]" /> Nguồn: <span className="font-bold text-orange-500">{currentReq.source || 'Walk-in'}</span></div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-blue-500 pl-3">Dịch vụ quan tâm</h4>
                                <div className="bg-slate-50 p-4 rounded-2xl flex flex-col justify-center h-[104px] border border-slate-100/50">
                                    <span className="text-blue-600 font-black text-sm uppercase leading-tight">{currentReq.service}</span>
                                    <span className="text-[10px] text-slate-400 mt-2 flex items-center gap-1"><Clock size={10} /> Tiếp nhận: {new Date(currentReq.created_at).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 text-left">
                            <div className="flex justify-between items-center">
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-orange-500 pl-3">Ghi chú đặc điểm khách hàng</h4>
                                {currentReq.notes !== note && <span className="text-[9px] font-bold text-orange-500 animate-pulse italic underline">Có thay đổi chưa lưu</span>}
                            </div>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Nhập ghi chú chi tiết về sở thích, đặc điểm khách hàng..."
                                className="w-full h-44 bg-slate-50 border border-slate-200 rounded-3xl p-5 text-sm outline-none focus:border-[#00d084] focus:bg-white transition-all resize-none shadow-inner"
                            />
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleSaveNote}
                                    disabled={isSaving || currentReq.notes === note}
                                    className="flex items-center gap-2 bg-[#00d084] text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase shadow-lg shadow-[#00d084]/20 disabled:opacity-50 transition-all hover:brightness-105 active:scale-95"
                                >
                                    <Save size={14} /> {isSaving ? 'Đang lưu...' : 'Lưu ghi chú'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI: Nhật ký tiến trình */}
                    <div className="w-full md:flex-1 bg-slate-50/50 p-8 overflow-y-auto custom-scrollbar border-t md:border-t-0 text-left flex flex-col">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                            <History size={14} /> Nhật ký tiến trình
                        </h4>

                        <div className="relative border-l-2 border-slate-200 ml-2 pl-6 space-y-8 pb-4 flex-1">
                            {currentReq.history && currentReq.history.length > 0 ? (
                                currentReq.history.map((item, index) => (
                                    <div key={item.id} className="relative">
                                        {/* Điểm mốc trên Timeline */}
                                        <div className={`absolute -left-[33px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 
                                            ${index === 0 ? 'bg-[#00d084] scale-125' : 'bg-slate-300'}`} />

                                        <div className="flex flex-col min-w-0">
                                            <div className="flex justify-between items-center gap-2">
                                                {/* Badge trạng thái có màu sắc */}
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-tighter truncate ${getStatusStyle(item.status)}`}>
                                                    {item.status}
                                                </span>
                                                <span className="text-[9px] text-slate-400 font-bold uppercase shrink-0">
                                                    {item.createdBy || 'Hệ thống'}
                                                </span>
                                            </div>
                                            <span className="text-[9px] text-slate-400 font-medium italic mt-1">
                                                {new Date(item.created_at).toLocaleString('vi-VN')}
                                            </span>

                                            {/* Box ghi chú trong Timeline - Sửa lỗi tràn khung văn bản */}
                                            <div className="mt-2 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm w-full">
                                                <p className="text-[12px] text-slate-600 leading-relaxed font-medium break-words whitespace-pre-wrap">
                                                    {item.note}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-slate-400 text-xs italic py-10 text-center border-2 border-dashed border-slate-200 rounded-3xl h-32 flex items-center justify-center">
                                    Chưa có lịch sử cập nhật.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}</style>
        </div>
    );
};

export default CustomerDetailModal;