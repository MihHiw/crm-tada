"use client";
import { Home, LogOut, Star, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserPage() {
    const router = useRouter();

    const [user] = useState<any>((() => {
        if (typeof window !== 'undefined') {
            const session = localStorage.getItem('user_session');
            return session ? JSON.parse(session) : null;
        }
        return null;
    }));

    useEffect(() => {
        // Chỉ dùng useEffect để kiểm tra việc chuyển hướng (Redirect logic)
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    const handleLogout = () => {
        localStorage.removeItem('user_session');
        router.push('/login');
    };

    // Chặn hiển thị nội dung cho đến khi xác thực xong
    if (!user) {
        return (
            <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center text-white font-sans">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium">Đang tải dữ liệu người dùng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0f1a] text-white p-8 font-sans">
            <div className="max-w-4xl mx-auto text-center">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                    <UserIcon size={40} className="text-blue-400" />
                </div>
                <h1 className="text-3xl font-bold mb-2 tracking-tight">Chào mừng trở lại, {user.name}!</h1>
                <p className="text-slate-400 mb-12">Đây là không gian làm việc cá nhân của bạn.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div className="bg-[#111827] p-8 rounded-[32px] border border-white/5 hover:border-blue-500/30 transition-all group cursor-pointer shadow-lg">
                        <Home className="text-slate-500 mb-4 group-hover:text-blue-400 transition-colors" />
                        <h3 className="font-bold text-lg mb-2">Trang chủ của tôi</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">Xem tất cả các hoạt động gần đây và tài liệu cá nhân của bạn tại đây.</p>
                    </div>
                    <div className="bg-[#111827] p-8 rounded-[32px] border border-white/5 hover:border-blue-500/30 transition-all group cursor-pointer shadow-lg">
                        <Star className="text-slate-500 mb-4 group-hover:text-yellow-400 transition-colors" />
                        <h3 className="font-bold text-lg mb-2">Dự án yêu thích</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">Truy cập nhanh vào các dự án và tài vụ mà bạn đã đánh dấu ưu tiên.</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="mt-12 text-slate-500 hover:text-red-400 transition-all flex items-center gap-2 mx-auto text-sm font-medium"
                >
                    <LogOut size={16} /> Đăng xuất khỏi hệ thống
                </button>
            </div>
        </div>
    );
}