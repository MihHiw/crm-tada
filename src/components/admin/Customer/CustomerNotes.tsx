"use client";

import { format, parseISO } from 'date-fns';
import { CheckCircle2, FileText, User } from 'lucide-react';
import Image from 'next/image';

// 1. Định nghĩa lại Interface khớp hoàn toàn với Hook
interface Note {
    id: string;
    content: string;
    type: 'normal' | 'important';
    author: string;
    createdAt: string; // Đồng bộ với trường createdAt từ hook
    authorAvatar?: string;
}

interface CustomerNotesProps {
    notes: Note[];
}

const NoteItem = ({ note }: { note: Note }) => {
    const isManager = note.author.includes('Quản lý') || note.type === 'important';

    // Hàm format thời gian an toàn
    const formatDateTime = (dateStr: string) => {
        try {
            return format(parseISO(dateStr), 'dd/MM/yyyy HH:mm');
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="flex gap-4 mb-6 last:mb-0">
            {/* Avatar người viết ghi chú */}
            <div className="shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm">
                    {note.authorAvatar ? (
                        <Image src={note.authorAvatar} alt={note.author} width={32} height={32} className="object-cover" />
                    ) : (
                        <User size={16} className="text-gray-400" />
                    )}
                </div>
            </div>

            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[12px] font-black text-[#1A202C] uppercase tracking-tight">
                        {note.author}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">
                        {formatDateTime(note.createdAt)}
                    </span>
                </div>

                <div className={`p-4 rounded-2xl border text-[13px] leading-relaxed shadow-sm transition-all ${note.type === 'important'
                        ? 'bg-rose-50 border-rose-100 text-rose-700 font-medium'
                        : 'bg-[#F7FAFC] border-gray-100 text-[#4A5568]'
                    }`}>
                    {note.content}
                </div>

                {isManager && (
                    <div className="mt-1.5 flex items-center gap-1">
                        <CheckCircle2 size={12} className={note.type === 'important' ? 'text-rose-500' : 'text-blue-500'} />
                        <span className={`text-[9px] font-black uppercase tracking-widest ${note.type === 'important' ? 'text-rose-500' : 'text-blue-500'}`}>
                            {note.type === 'important' ? 'Lưu ý quan trọng' : 'Tin nhắn hệ thống'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

const CustomerNotes = ({ notes }: CustomerNotesProps) => {
    return (
        <div className="flex flex-col h-full">
            {/* Input Box */}
            <div className="relative mb-8 group">
                <textarea
                    placeholder="Nhập ghi chú chăm sóc khách hàng..."
                    className="w-full bg-[#F7FAFC] border-2 border-transparent rounded-3xl p-5 pb-14 text-sm focus:bg-white focus:border-[#00E676]/20 focus:ring-0 transition-all min-h-[120px] placeholder:text-gray-400 shadow-inner"
                />
                <div className="absolute bottom-4 right-4">
                    <button className="bg-[#00E676] text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-[#00c864] hover:shadow-lg hover:shadow-green-100 transition-all flex items-center gap-2 active:scale-95">
                        Lưu ghi chú
                    </button>
                </div>
            </div>

            {/* List Ghi chú */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {notes && notes.length > 0 ? (
                    [...notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((note) => <NoteItem key={note.id} note={note} />)
                ) : (
                    <div className="text-center py-16 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                        <FileText size={48} className="mx-auto text-gray-200 mb-3" />
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lịch sử ghi chú trống</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerNotes;