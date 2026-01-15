"use client";

import { format, parseISO } from 'date-fns';
import { CheckCircle2, FileText, Send, User } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

// --- TYPES ---
export interface Note {
    id: string;
    content: string;
    type: 'normal' | 'important';
    author: string;
    createdAt: string;
    authorAvatar?: string;
}

interface CustomerNotesProps {
    notes: Note[];
    // Thêm prop này để gọi hàm lưu từ component cha
    onAddNote: (content: string) => Promise<void> | void;
}

// --- SUB COMPONENT: NOTE ITEM ---
const NoteItem = ({ note }: { note: Note }) => {
    const isManager = note.author.includes('Quản lý') || note.type === 'important';

    const formatDateTime = (dateStr: string) => {
        try {
            return format(parseISO(dateStr), 'dd/MM/yyyy HH:mm');
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="flex gap-4 mb-6 last:mb-0 group animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Avatar */}
            <div className="shrink-0">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/10 shadow-sm text-white/50">
                    {note.authorAvatar ? (
                        <Image src={note.authorAvatar} alt={note.author} width={32} height={32} className="object-cover" />
                    ) : (
                        <User size={14} />
                    )}
                </div>
            </div>

            <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] font-black text-white uppercase tracking-tight">
                        {note.author}
                    </span>
                    <span className="text-[10px] text-white/30 font-bold font-mono">
                        {formatDateTime(note.createdAt)}
                    </span>
                </div>

                {/* Nội dung note */}
                <div className={`p-4 rounded-2xl border text-[13px] leading-relaxed shadow-sm transition-all ${note.type === 'important'
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-300 font-medium'
                        : 'bg-white/5 border-white/5 text-white/80 group-hover:bg-white/10'
                    }`}>
                    {note.content}
                </div>

                {isManager && (
                    <div className="mt-1.5 flex items-center gap-1.5 opacity-60">
                        <CheckCircle2 size={12} className={note.type === 'important' ? 'text-rose-400' : 'text-blue-400'} />
                        <span className={`text-[9px] font-black uppercase tracking-widest ${note.type === 'important' ? 'text-rose-400' : 'text-blue-400'}`}>
                            {note.type === 'important' ? 'Lưu ý quan trọng' : 'Tin nhắn hệ thống'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const CustomerNotes = ({ notes, onAddNote }: CustomerNotesProps) => {
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!content.trim()) return; // Không lưu nếu rỗng

        setIsSaving(true);
        try {
            await onAddNote(content); // Gọi hàm từ Props
            setContent(''); // Reset ô nhập sau khi lưu thành công
        } catch (error) {
            console.error("Lỗi lưu ghi chú:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Ctrl + Enter để lưu nhanh
        if (e.key === 'Enter' && e.ctrlKey) {
            handleSave();
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Input Box */}
            <div className="relative mb-8 group">
                <textarea
                    placeholder="Nhập ghi chú... (Ctrl + Enter để lưu)"
                    className="w-full bg-black/30 border border-white/10 rounded-[1.5rem] p-5 pb-14 text-sm text-white focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all min-h-[120px] placeholder:text-white/20 outline-none resize-none disabled:opacity-50"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isSaving}
                />
                <div className="absolute bottom-4 right-4">
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !content.trim()}
                        className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Send size={14} /> Lưu ghi chú
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* List Ghi chú */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {notes && notes.length > 0 ? (
                    // Sắp xếp ghi chú mới nhất lên đầu
                    [...notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((note) => <NoteItem key={note.id} note={note} />)
                ) : (
                    <div className="text-center py-12 bg-white/5 rounded-[1.5rem] border border-dashed border-white/10">
                        <FileText size={32} className="mx-auto text-white/20 mb-3" />
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Chưa có ghi chú nào</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerNotes;