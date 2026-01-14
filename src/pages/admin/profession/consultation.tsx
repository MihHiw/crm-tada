"use client";
import CustomerDetailModal from '@/components/admin/CustomerDetailModal';
import SchedulerModal from '@/components/admin/SchedulerModal';
import { Sidebar } from '@/components/admin/Sidebar';
import {
    ConsultationRequest,
    ConsultationStatus,
    History, // Bây giờ import sẽ hết lỗi nếu bạn đã export ở file Hook
    useConsultationData
} from '@/hooks/consultationData/useConsultationData';
import {
    Calendar,
    CheckCircle2,
    Clock,
    LucideIcon,
    MessageSquare,
    Phone,
    Plus,
    XCircle
} from 'lucide-react';
import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// 1. Định nghĩa Interface cấu hình cột rõ ràng
interface ColumnConfig {
    label: string;
    icon: LucideIcon;
    color: string;
    bg: string;
}

const KANBAN_COLUMNS: Record<ConsultationStatus, ColumnConfig> = {
    PENDING: { label: 'Tiếp nhận', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    CONTACTED: { label: 'Đang tư vấn', icon: Phone, color: 'text-orange-600', bg: 'bg-orange-50' },
    UNREACHABLE: { label: 'Tạm dừng', icon: MessageSquare, color: 'text-gray-600', bg: 'bg-gray-100' },
    APPOINTMENT: { label: 'Hẹn lịch', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    SUCCESS: { label: 'Hoàn thành', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    CANCELLED: { label: 'Hủy bỏ', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
};

const ConsultationKanban: React.FC = () => {
    const { data: requests, loading, updateStatus, deleteRequest } = useConsultationData();
    const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null);
    const [viewingRequest, setViewingRequest] = useState<ConsultationRequest | null>(null);

    // UX: Nhóm dữ liệu theo cột và memoize để tránh tính toán lại dư thừa
    const columns = useMemo(() => {
        const grouped = {} as Record<ConsultationStatus, ConsultationRequest[]>;
        (Object.keys(KANBAN_COLUMNS) as ConsultationStatus[]).forEach(status => {
            grouped[status] = requests.filter(r => r.status === status);
        });
        return grouped;
    }, [requests]);

    const handleConfirmSchedule = async (data: { date: string; time: string }): Promise<void> => {
        if (selectedRequest) {
            const note = `📅 Lịch hẹn: ${data.date} lúc ${data.time}`;
            // Cập nhật status để nhảy cột và tự động lưu vào history
            await updateStatus(selectedRequest.id, 'APPOINTMENT', note);
            setSelectedRequest(null);
            MySwal.fire({
                icon: 'success',
                title: 'Đã cập nhật lịch hẹn',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        }
    };

    const handleAction = async (id: string, nextStatus: ConsultationStatus, title: string): Promise<void> => {
        const { value: note } = await MySwal.fire({
            title: `<span class="text-lg font-bold">${title}</span>`,
            input: 'textarea',
            inputPlaceholder: 'Nhập nội dung ghi chú cho tiến trình này...',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận cập nhật',
            cancelButtonText: 'Đóng',
            confirmButtonColor: '#A33446',
            customClass: {
                popup: 'rounded-[1.5rem] p-6',
                input: 'rounded-xl text-sm border-gray-200'
            }
        });

        if (note !== undefined) {
            const finalNote = note || `Chuyển trạng thái sang ${KANBAN_COLUMNS[nextStatus].label}`;
            await updateStatus(id, nextStatus, finalNote);
        }
    };

    const renderCard = (req: ConsultationRequest): JSX.Element => {
        // Luôn lấy phần tử đầu tiên của mảng history (mới nhất) để hiện lên thẻ
        const latestHistory: History | null = req.history && req.history.length > 0 ? req.history[0] : null;

        return (
            <div
                key={req.id}
                onClick={() => setViewingRequest(req)}
                className="group bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#A33446]/30 transition-all cursor-pointer relative mb-3 overflow-hidden"
            >
                {/* 1. Header: Avatar & Thông tin */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden relative border border-slate-200">
                            {req.customer_avatar ? (
                                <Image
                                    src={req.customer_avatar}
                                    alt={req.customer_name}
                                    fill
                                    className="object-cover"
                                    sizes="36px"
                                />
                            ) : (
                                <span className="font-bold text-xs">{req.customer_name.charAt(0)}</span>
                            )}
                        </div>
                        <div className="text-left">
                            <h4 className="font-bold text-gray-800 text-[13px] leading-tight line-clamp-1 uppercase">
                                {req.customer_name}
                            </h4>
                            <p className="text-gray-400 text-[11px] font-medium flex items-center gap-1 mt-0.5">
                                <Phone size={10} /> {req.customer_phone}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            deleteRequest(req.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-all"
                    >
                        <XCircle size={14} />
                    </button>
                </div>

                {/* 2. Body: Dịch vụ & Nhật ký mới nhất */}
                <div className="space-y-2 text-left bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Dịch vụ quan tâm</span>
                        <p className="text-[11px] font-bold text-[#A33446] leading-snug">
                            {req.service || "Chưa xác định"}
                        </p>
                    </div>

                    <div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Tiến trình gần nhất</span>
                        <p className="text-[11px] text-gray-600 leading-relaxed line-clamp-2 italic font-medium">
                            {/* Ưu tiên hiển thị note từ history để thấy được "Hẹn lịch" */}
                            {latestHistory ? latestHistory.note : (req.notes || "Chưa có nội dung tư vấn...")}
                        </p>
                    </div>
                </div>

                {/* 3. Footer: Nút thao tác động */}
                <div className="mt-4 flex gap-1.5">
                    {req.status === 'PENDING' && (
                        <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleAction(req.id, 'CONTACTED', 'Bắt đầu tư vấn'); }}
                            className="flex-1 py-2 bg-[#A33446] text-white text-[10px] font-bold rounded-lg uppercase transition-all hover:brightness-110 active:scale-95 shadow-sm shadow-[#A33446]/20">Tư vấn ngay</button>
                    )}
                    {req.status === 'CONTACTED' && (
                        <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); setSelectedRequest(req); }}
                            className="flex-1 py-2 bg-purple-600 text-white text-[10px] font-bold rounded-lg uppercase transition-all hover:brightness-110 active:scale-95 shadow-sm shadow-purple-600/20">Chốt lịch</button>
                    )}
                    {req.status === 'APPOINTMENT' && (
                        <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleAction(req.id, 'SUCCESS', 'Hoàn tất dịch vụ'); }}
                            className="flex-1 py-2 bg-green-600 text-white text-[10px] font-bold rounded-lg uppercase transition-all hover:brightness-110 active:scale-95 shadow-sm shadow-green-600/20">Hoàn tất</button>
                    )}
                    {['CONTACTED', 'UNREACHABLE', 'APPOINTMENT'].includes(req.status) && (
                        <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleAction(req.id, 'CANCELLED', 'Hủy hồ sơ tư vấn'); }}
                            className="px-3 py-2 bg-gray-100 text-gray-400 text-[10px] font-bold rounded-lg uppercase transition-all hover:bg-red-50 hover:text-red-500">Hủy</button>
                    )}
                </div>

                {/* Tag Nguồn khách hàng */}
                <div className="absolute top-2 right-2 flex gap-1 pointer-events-none">
                    <span className="text-[8px] bg-white/90 backdrop-blur px-1.5 py-0.5 rounded border border-slate-100 text-slate-400 font-bold uppercase shadow-sm">{req.source || 'Walk-in'}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen w-full bg-[#FDF8F9] overflow-hidden font-sans text-slate-600">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0 lg:ml-64 bg-[#FFF5F7]/30">
                <header className="h-20 flex justify-between items-center px-8 border-b border-gray-100 bg-white shadow-sm z-10">
                    <div className="text-left">
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight leading-none italic">QUY TRÌNH TƯ VẤN</h2>
                        <p className="text-gray-400 text-xs font-medium mt-1.5 uppercase tracking-widest opacity-70">Pipeline Management</p>
                    </div>
                    <button className="flex items-center gap-2 bg-[#A33446] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#A33446]/20 hover:scale-105 active:scale-95 transition-all">
                        <Plus size={18} /> Thêm khách mới
                    </button>
                </header>

                <main className="flex-1 overflow-x-auto p-6 flex gap-6 custom-scrollbar">
                    {loading ? (
                        <div className="w-full h-full flex items-center justify-center gap-3">
                            <div className="w-2 h-2 bg-[#A33446] rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-[#A33446] rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-2 h-2 bg-[#A33446] rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    ) : (
                        (Object.keys(KANBAN_COLUMNS) as ConsultationStatus[]).map((key) => {
                            const config = KANBAN_COLUMNS[key];
                            const ColumnIcon = config.icon;
                            const columnData = columns[key] || [];

                            return (
                                <section key={key} className="w-[320px] shrink-0 flex flex-col h-full bg-gray-100/50 rounded-3xl border border-gray-100 shadow-inner overflow-hidden">
                                    <div className="p-5 flex items-center justify-between flex-shrink-0">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`p-1.5 rounded-lg ${config.bg} ${config.color}`}>
                                                <ColumnIcon size={16} />
                                            </div>
                                            <h3 className="font-bold text-gray-700 text-sm tracking-tight">{config.label}</h3>
                                        </div>
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white border border-gray-100 text-gray-400 shadow-sm">
                                            {columnData.length}
                                        </span>
                                    </div>

                                    <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar space-y-1">
                                        {columnData.map(renderCard)}
                                        {columnData.length === 0 && (
                                            <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                                                <p className="text-[10px] font-bold text-gray-300 uppercase italic tracking-widest">Trống</p>
                                            </div>
                                        )}
                                        <button className="w-full py-4 border border-dashed border-gray-200 rounded-2xl text-gray-400 text-[10px] font-black hover:border-[#A33446] hover:text-[#A33446] bg-white/40 transition-all mt-2 uppercase tracking-tighter">
                                            + THÊM HỒ SƠ TƯ VẤN
                                        </button>
                                    </div>
                                </section>
                            );
                        })
                    )}
                </main>
            </div>

            <SchedulerModal
                req={selectedRequest}
                onClose={() => setSelectedRequest(null)}
                onConfirm={handleConfirmSchedule}
            />

            <CustomerDetailModal
                req={viewingRequest}
                onClose={() => setViewingRequest(null)}
            />

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
            `}</style>
        </div>
    );
};

export default ConsultationKanban;