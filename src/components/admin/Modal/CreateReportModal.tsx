"use client";
import { CheckCircle2, FileText, X } from 'lucide-react';

export default function CreateReportModal({ isOpen, onClose, template, onSubmit }: any) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative bg-[#161D2F] border border-gray-800 w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600/20 rounded-lg text-blue-500">
                                <FileText size={20} />
                            </div>
                            <h3 className="text-white font-bold text-lg">Tạo báo cáo mới</h3>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">Loại báo cáo</label>
                            <div className="bg-[#0B0F1A] p-3 rounded-xl border border-gray-800 text-sm text-blue-400 font-medium">
                                {template?.title}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">Định dạng file</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['PDF', 'Excel', 'CSV'].map((ext) => (
                                    <button key={ext} className="py-2 bg-[#0B0F1A] border border-gray-800 rounded-xl text-xs text-gray-400 hover:border-blue-500 hover:text-white transition-all">
                                        {ext}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">Ghi chú thêm</label>
                            <textarea
                                className="w-full bg-[#0B0F1A] border border-gray-800 rounded-xl p-3 text-sm text-white h-24 focus:outline-none focus:border-blue-500"
                                placeholder="Ví dụ: Gửi cho ban giám đốc..."
                            />
                        </div>

                        <button
                            onClick={onSubmit}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                        >
                            <CheckCircle2 size={18} /> Xác nhận tạo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}