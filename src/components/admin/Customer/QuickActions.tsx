import { Mail, MoreHorizontal, Phone } from 'lucide-react';

export function QuickActions() {
    return (
        <div className="bg-[#161D2F] p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
            <div className="flex gap-4">
                <button className="flex items-center gap-2 bg-[#0B0F1A] px-4 py-2 rounded-xl text-xs font-bold border border-gray-800 hover:bg-gray-800">
                    <Phone size={14} className="text-blue-500" /> Ghi cuộc gọi
                </button>
                <button className="flex items-center gap-2 bg-[#0B0F1A] px-4 py-2 rounded-xl text-xs font-bold border border-gray-800 hover:bg-gray-800">
                    <Mail size={14} className="text-blue-500" /> Gửi Email
                </button>
            </div>
            <MoreHorizontal size={20} className="text-gray-500 cursor-pointer" />
        </div>
    );
}

export function CustomerTabs() {
    return (
        <div className="flex gap-8 border-b border-gray-800">
            <button className="pb-4 text-sm font-bold text-blue-500 border-b-2 border-blue-500">Tổng quan</button>
            <button className="pb-4 text-sm font-bold text-gray-500 hover:text-white">Lịch sử tương tác</button>
            <button className="pb-4 text-sm font-bold text-gray-500 hover:text-white">Tài sản & Đầu tư</button>
        </div>
    );
}