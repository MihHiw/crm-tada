"use client";

import CustomerDetailModal from '@/components/admin/CustomerDetailModal';
import CreateRequestModal, { CreateRequestData } from '@/components/admin/modal/ModalConsultation';
import SchedulerModal from '@/components/admin/SchedulerModal';
import { Sidebar } from '@/components/admin/Sidebar';
import GlobalBackground from '@/components/GlobalBackground';
import {
    ConsultationRequest,
    ConsultationStatus,
    History,
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

interface ColumnConfig {
    label: string;
    icon: LucideIcon;
    color: string;
    bg: string;
}

const KANBAN_COLUMNS: Record<ConsultationStatus, ColumnConfig> = {
    PENDING: { label: 'Tiếp nhận', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    CONTACTED: { label: 'Đang tư vấn', icon: Phone, color: 'text-orange-400', bg: 'bg-orange-500/20' },
    UNREACHABLE: { label: 'Tạm dừng', icon: MessageSquare, color: 'text-gray-400', bg: 'bg-gray-500/20' },
    APPOINTMENT: { label: 'Hẹn lịch', icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    SUCCESS: { label: 'Hoàn thành', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/20' },
    CANCELLED: { label: 'Hủy bỏ', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' },
};

const ConsultationKanban: React.FC = () => {
    // Lấy hàm addRequest từ hook
    const { data: requests, loading, updateStatus, deleteRequest, addRequest } = useConsultationData();

    const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null);
    const [viewingRequest, setViewingRequest] = useState<ConsultationRequest | null>(null);

    // State điều khiển modal thêm mới
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const columns = useMemo(() => {
        const grouped = {} as Record<ConsultationStatus, ConsultationRequest[]>;
        (Object.keys(KANBAN_COLUMNS) as ConsultationStatus[]).forEach(status => {
            grouped[status] = requests.filter(r => r.status === status);
        });
        return grouped;
    }, [requests]);

    // --- XỬ LÝ THÊM MỚI ---
    const handleCreateRequest = async (formData: CreateRequestData) => {
        if (addRequest) {
            await addRequest(formData);
            setIsCreateModalOpen(false);

            // Thông báo thành công
            MySwal.fire({
                icon: 'success',
                title: 'Thêm khách hàng thành công!',
                text: 'Hồ sơ đã được chuyển vào cột "Tiếp nhận"',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                background: '#1e293b',
                color: '#fff'
            });
        }
    };

    const handleConfirmSchedule = async (data: { date: string; time: string }): Promise<void> => {
        if (selectedRequest) {
            const note = `📅 Lịch hẹn: ${data.date} lúc ${data.time}`;
            await updateStatus(selectedRequest.id, 'APPOINTMENT', note);
            setSelectedRequest(null);
            MySwal.fire({
                icon: 'success',
                title: 'Đã cập nhật lịch hẹn',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                background: '#1e293b',
                color: '#fff'
            });
        }
    };

    const handleAction = async (id: string, nextStatus: ConsultationStatus, title: string): Promise<void> => {
        const { value: note } = await MySwal.fire({
            title: `<span class="text-lg font-bold text-slate-700">${title}</span>`,
            input: 'textarea',
            inputPlaceholder: 'Nhập nội dung ghi chú...',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
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
        const latestHistory: History | null = req.history && req.history.length > 0 ? req.history[0] : null;

        return (
            <div
                key={req.id}
                onClick={() => setViewingRequest(req)}
                className="group bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg hover:bg-white/20 transition-all cursor-pointer relative mb-3 overflow-hidden text-white"
            >
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white overflow-hidden relative border border-white/20">
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
                            <h4 className="font-bold text-white text-[13px] leading-tight line-clamp-1 uppercase tracking-wide">
                                {req.customer_name}
                            </h4>
                            <p className="text-white/70 text-[11px] font-medium flex items-center gap-1 mt-0.5">
                                <Phone size={10} /> {req.customer_phone}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            deleteRequest(req.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded-lg text-white/50 hover:text-red-400 transition-all"
                    >
                        <XCircle size={14} />
                    </button>
                </div>

                <div className="space-y-2 text-left bg-black/20 p-3 rounded-xl border border-white/5">
                    <div>
                        <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest block mb-0.5">Dịch vụ quan tâm</span>
                        <p className="text-[11px] font-bold text-pink-300 leading-snug">
                            {req.service || "Chưa xác định"}
                        </p>
                    </div>

                    <div>
                        <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest block mb-0.5">Tiến trình gần nhất</span>
                        <p className="text-[11px] text-white/80 leading-relaxed line-clamp-2 italic font-medium">
                            {latestHistory ? latestHistory.note : (req.notes || "Chưa có nội dung tư vấn...")}
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex gap-1.5">
                    {req.status === 'PENDING' && (
                        <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleAction(req.id, 'CONTACTED', 'Bắt đầu tư vấn'); }}
                            className="flex-1 py-2 bg-[#A33446] hover:bg-[#c23d53] text-white text-[10px] font-bold rounded-lg uppercase transition-all shadow-lg">Tư vấn ngay</button>
                    )}
                    {req.status === 'CONTACTED' && (
                        <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); setSelectedRequest(req); }}
                            className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold rounded-lg uppercase transition-all shadow-lg">Chốt lịch</button>
                    )}
                    {req.status === 'APPOINTMENT' && (
                        <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleAction(req.id, 'SUCCESS', 'Hoàn tất dịch vụ'); }}
                            className="flex-1 py-2 bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold rounded-lg uppercase transition-all shadow-lg">Hoàn tất</button>
                    )}
                    {['CONTACTED', 'UNREACHABLE', 'APPOINTMENT'].includes(req.status) && (
                        <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleAction(req.id, 'CANCELLED', 'Hủy hồ sơ tư vấn'); }}
                            className="px-3 py-2 bg-white/10 hover:bg-red-500/20 text-white/70 hover:text-red-300 text-[10px] font-bold rounded-lg uppercase transition-all">Hủy</button>
                    )}
                </div>

                <div className="absolute top-2 right-2 flex gap-1 pointer-events-none">
                    <span className="text-[8px] bg-white/20 backdrop-blur px-1.5 py-0.5 rounded border border-white/10 text-white/80 font-bold uppercase shadow-sm">{req.source || 'Walk-in'}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen w-full overflow-hidden font-sans text-white relative">
            <GlobalBackground />

            <div className="w-[260px] flex-shrink-0 h-full border-r border-white/10 bg-slate-900/60 backdrop-blur-xl z-20">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col min-w-0 h-full relative z-10 scrollbar-hide">
                <header className="h-20 flex justify-between items-center px-8 border-b border-white/10 bg-slate-900/40 backdrop-blur-md shadow-sm z-10">
                    <div className="text-left">
                        <h2 className="text-xl font-black text-white uppercase tracking-tight leading-none italic">QUY TRÌNH TƯ VẤN</h2>
                        <p className="text-white/60 text-xs font-medium mt-1.5 uppercase tracking-widest opacity-70">Pipeline Management</p>
                    </div>
                    {/* BUTTON MỞ MODAL */}
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-[#A33446] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#A33446]/30 hover:scale-105 active:scale-95 transition-all"
                    >
                        <Plus size={18} /> Thêm khách mới
                    </button>
                </header>

                <main className="flex-1 overflow-x-auto p-6 flex gap-6 custom-scrollbar">
                    {loading ? (
                        <div className="w-full h-full flex items-center justify-center gap-3">
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    ) : (
                        (Object.keys(KANBAN_COLUMNS) as ConsultationStatus[]).map((key) => {
                            const config = KANBAN_COLUMNS[key];
                            const ColumnIcon = config.icon;
                            const columnData = columns[key] || [];

                            return (
                                <section key={key} className="w-[320px] shrink-0 flex flex-col h-full bg-black/20 backdrop-blur-sm rounded-3xl border border-white/5 shadow-inner overflow-hidden">
                                    <div className="p-5 flex items-center justify-between flex-shrink-0">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`p-1.5 rounded-lg ${config.bg} ${config.color}`}>
                                                <ColumnIcon size={16} />
                                            </div>
                                            <h3 className="font-bold text-white text-sm tracking-tight">{config.label}</h3>
                                        </div>
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-white/70 shadow-sm">
                                            {columnData.length}
                                        </span>
                                    </div>

                                    <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar space-y-1">
                                        {columnData.map(renderCard)}
                                        {columnData.length === 0 && (
                                            <div className="py-10 text-center border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
                                                <p className="text-[10px] font-bold text-white/20 uppercase italic tracking-widest">Trống</p>
                                            </div>
                                        )}
                                        {/* Nút thêm nhanh ở cuối cột Tiếp nhận */}
                                        {key === 'PENDING' && (
                                            <button
                                                onClick={() => setIsCreateModalOpen(true)}
                                                className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-white/30 text-[10px] font-black hover:border-[#A33446] hover:text-[#A33446] hover:bg-white/5 transition-all mt-2 uppercase tracking-tighter"
                                            >
                                                + THÊM HỒ SƠ TƯ VẤN
                                            </button>
                                        )}
                                    </div>
                                </section>
                            );
                        })
                    )}
                </main>
            </div>

            {/* CÁC MODAL */}
            <SchedulerModal
                req={selectedRequest}
                onClose={() => setSelectedRequest(null)}
                onConfirm={handleConfirmSchedule}
            />

            <CustomerDetailModal
                req={viewingRequest}
                onClose={() => setViewingRequest(null)}
            />

            {/* MODAL THÊM KHÁCH MỚI */}
            <CreateRequestModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateRequest}
            />

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}</style>
        </div>
    );
};

export default ConsultationKanban;