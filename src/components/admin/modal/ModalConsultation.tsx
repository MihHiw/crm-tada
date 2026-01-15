"use client";

import { FileText, Phone, Save, Sparkles, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface CreateRequestData {
    customer_name: string;
    customer_phone: string;
    service: string;
    notes: string;
    source: string;
}

interface CreateRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateRequestData) => Promise<void>;
    isLoading?: boolean; // Thêm prop này để hiện loading từ phía cha nếu cần
}

export default function CreateRequestModal({ isOpen, onClose, onSubmit, isLoading = false }: CreateRequestModalProps) {
    const [formData, setFormData] = useState<CreateRequestData>({
        customer_name: '',
        customer_phone: '',
        service: '',
        notes: '',
        source: 'Walk-in'
    });

    const [isLocalSubmitting, setIsLocalSubmitting] = useState(false);

    // Reset form khi mở modal
    useEffect(() => {
        if (isOpen) {
            setFormData({ customer_name: '', customer_phone: '', service: '', notes: '', source: 'Walk-in' });
            setIsLocalSubmitting(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLocalSubmitting(true);
        try {
            await onSubmit(formData);
            // Không cần onClose ở đây nếu cha đã xử lý, nhưng để chắc chắn:
            // onClose(); 
        } catch (error) {
            console.error(error);
        } finally {
            setIsLocalSubmitting(false);
        }
    };

    const isProcessing = isLoading || isLocalSubmitting;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            {/* Modal Container */}
            <div className="bg-[#1e293b] w-full max-w-md rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div>
                        <h3 className="font-black text-white text-lg tracking-tight uppercase">Thêm khách mới</h3>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Tạo hồ sơ tư vấn dịch vụ</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="p-2.5 bg-white/5 border border-white/5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-5">

                        {/* Tên khách hàng */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">
                                Tên khách hàng <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-400 transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    required
                                    type="text"
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                    value={formData.customer_name}
                                    onChange={e => setFormData({ ...formData, customer_name: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-black/30 border border-white/10 rounded-2xl text-sm font-bold text-white placeholder-white/20 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Số điện thoại */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">
                                Số điện thoại <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-400 transition-colors">
                                    <Phone size={18} />
                                </div>
                                <input
                                    required
                                    type="tel"
                                    placeholder="Ví dụ: 0901234567"
                                    value={formData.customer_phone}
                                    onChange={e => setFormData({ ...formData, customer_phone: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-black/30 border border-white/10 rounded-2xl text-sm font-bold text-white placeholder-white/20 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Dịch vụ quan tâm */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">
                                Dịch vụ quan tâm
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-400 transition-colors">
                                    <Sparkles size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: Trị mụn, Tắm trắng..."
                                    value={formData.service}
                                    onChange={e => setFormData({ ...formData, service: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-black/30 border border-white/10 rounded-2xl text-sm font-bold text-white placeholder-white/20 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Ghi chú */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">
                                Ghi chú thêm
                            </label>
                            <div className="relative group">
                                <div className="absolute left-4 top-4 text-white/30 group-focus-within:text-emerald-400 transition-colors">
                                    <FileText size={18} />
                                </div>
                                <textarea
                                    rows={3}
                                    placeholder="Ghi chú về tình trạng khách, nguồn khách..."
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-black/30 border border-white/10 rounded-2xl text-sm font-medium text-white placeholder-white/20 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isProcessing}
                            className="flex-1 py-4 rounded-2xl border border-white/10 bg-white/5 text-white/60 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-rose-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <><Save size={16} /> Tạo hồ sơ</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}