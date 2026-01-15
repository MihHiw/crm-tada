"use client";

import { ClipboardList, Edit3, Mail, MessageSquare, Phone, Plus, Save, User, X } from 'lucide-react'; // 1. Thêm icon
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import CustomerNotes from '@/components/admin/customer/CustomerNotes';
import ServiceHistory from '@/components/admin/customer/ServiceHistory';
import { Sidebar } from '@/components/admin/Sidebar';
import GlobalBackground from '@/components/GlobalBackground';
// 2. Import thêm Type UpdateCustomerInput
import { UpdateCustomerInput, useCustomerDetail } from '@/hooks/customerDetail/useCustomerDetail';

export default function CustomerDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    // 3. Lấy thêm hàm updateCustomer từ hook
    const { customer, loading, addNote, updateCustomer } = useCustomerDetail(id);

    const rankName = customer?.membership?.rank_name || 'Thành viên';
    const rankColor = customer?.membership?.rank_color || '#c0c0c0';
    const points = customer?.membership?.current_points || 0;

    const [userRole, setUserRole] = useState<string | null>(null);

    // --- 4. STATE CHO MODAL SỬA ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<UpdateCustomerInput>({
        full_name: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserRole(parsedUser.role);
            } catch (error) {
                console.error("Lỗi đọc role:", error);
            }
        }
    }, []);

    const isKTV = userRole === 'ktv';

    // --- 5. HÀM XỬ LÝ (HANDLERS) ---

    // Mở modal và điền dữ liệu hiện tại
    const handleOpenEdit = () => {
        if (customer) {
            setEditFormData({
                full_name: customer.full_name || '',
                phone: customer.phone || '',
                email: customer.email || ''
            });
            setIsEditModalOpen(true);
        }
    };

    // Lưu thay đổi
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        // Gọi hàm update từ hook
        updateCustomer(editFormData);
        setIsEditModalOpen(false);
        // (Optional) Có thể thêm toast thông báo thành công ở đây
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-slate-900">
            <div className="animate-pulse text-emerald-400 font-bold uppercase tracking-widest">Đang tải hồ sơ khách hàng...</div>
        </div>
    );

    if (!customer) return (
        <div className="flex h-screen items-center justify-center flex-col gap-4 bg-slate-900 text-white">
            <p className="text-white/60 font-medium">Không tìm thấy thông tin khách hàng trong hệ thống</p>
            <button onClick={() => router.back()} className="bg-white/10 px-6 py-2 rounded-xl shadow-sm border border-white/10 text-white font-bold hover:bg-white/20 transition-all">Quay lại</button>
        </div>
    );

    return (
        // ROOT: Dark Mode + Glass
        <div className="flex h-screen w-full overflow-hidden font-sans text-white">
            <GlobalBackground />

            {/* Sidebar Glass */}
            <div className="w-[260px] flex-shrink-0 h-full border-r border-white/10 bg-slate-900/60 backdrop-blur-xl z-20">
                <Sidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-10 scrollbar-hide">
                <div className="max-w-[1240px] mx-auto pt-8 px-6 w-full pb-10">

                    {/* BREADCRUMB */}
                    <div className="flex items-center gap-2 text-[14px] text-white/50 mb-6 font-medium">
                        <span className="cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => router.push('/admin/staff/customers/')}>Khách hàng</span>
                        <span>&rsaquo;</span>
                        <span className="text-white font-bold">Hồ sơ: {customer.full_name}</span>
                    </div>

                    {/* HEADER PROFILE CARD (GLASS) */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-white/10 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="relative w-24 h-24 flex-shrink-0">
                                <Image
                                    src={customer.avatar_url || "https://i.pravatar.cc/150?u=default"}
                                    alt={customer.full_name}
                                    fill
                                    className="rounded-full object-cover border-4 border-white/10 shadow-lg"
                                    sizes="96px"
                                />
                                {!isKTV && (
                                    <span
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-1 rounded-full text-white uppercase shadow-lg whitespace-nowrap z-10 border border-white/20"
                                        style={{ backgroundColor: rankColor }}
                                    >
                                        {rankName}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white tracking-tight">{customer.full_name}</h2>
                                <div className="flex flex-wrap items-center gap-3 mt-3">
                                    {!isKTV && (
                                        <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></div>
                                            <span className="text-emerald-300 text-xs font-bold">
                                                {points.toLocaleString()} XP
                                            </span>
                                        </div>
                                    )}
                                    <span className="text-white/40 text-xs font-mono font-bold px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">ID: {customer.id}</span>
                                    <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase border ${customer.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                        {customer.is_active ? 'Hoạt động' : 'Tạm khóa'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            <div className="flex gap-3">
                                {!isKTV && (
                                    <button
                                        onClick={handleOpenEdit} // 6. Gắn sự kiện mở modal
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/20 transition-all border border-white/5"
                                    >
                                        <Edit3 size={16} /> Sửa Thông tin
                                    </button>
                                )}
                                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/20 transition-all border border-white/5">
                                    <MessageSquare size={16} /> Tin nhắn
                                </button>
                            </div>
                            {!isKTV && (
                                <button
                                    onClick={() => router.push("/admin/profession/booking")}
                                    className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30 active:scale-95"
                                >
                                    <Plus size={18} /> Đặt lịch hẹn
                                </button>
                            )}
                        </div>
                    </div>

                    {/* CONTENT GRID */}
                    <div className="grid grid-cols-12 gap-8">
                        {/* LEFT COLUMN */}
                        <div className="col-span-12 lg:col-span-4 space-y-8">
                            <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl border border-white/10">
                                <h3 className="font-bold text-white mb-6 flex items-center gap-3 text-lg">
                                    <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                                        <ClipboardList size={20} />
                                    </div>
                                    Thông tin liên hệ
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/80"><Phone size={18} /></div>
                                        <div>
                                            <p className="text-xs text-white/40 font-bold uppercase tracking-wider mb-0.5">Số điện thoại</p>
                                            <p className="text-sm font-bold text-white tracking-widest font-mono">{customer.phone || 'Chưa cập nhật'}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-white/40 font-bold mb-3 uppercase tracking-widest">Đặc điểm làn da</p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="bg-amber-500/10 text-amber-300 px-3 py-1.5 rounded-lg text-[11px] font-bold border border-amber-500/20">Hỗn hợp thiên dầu</span>
                                            <span className="bg-rose-500/10 text-rose-300 px-3 py-1.5 rounded-lg text-[11px] font-bold border border-rose-500/20">Dễ kích ứng</span>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/10">
                                        <p className="text-xs text-emerald-400 font-bold mb-3 uppercase text-[10px] tracking-widest">Chỉ dẫn chuyên môn cho KTV</p>
                                        <div className="bg-emerald-500/5 p-4 rounded-xl border border-dashed border-emerald-500/30">
                                            <p className="text-xs font-medium leading-relaxed italic text-emerald-100/80">
                                                Khách không thích nói chuyện nhiều lúc làm dịch vụ. Dị ứng với hương liệu mạnh. Ưu tiên nằm phòng yên tĩnh.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="col-span-12 lg:col-span-8 space-y-8">
                            {/* THỐNG KÊ CHI TIÊU */}
                            {!isKTV && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Tổng chi tiêu', value: `${customer.stats.totalSpent.toLocaleString()} đ`, color: 'text-white' },
                                        { label: 'Số lần đến', value: customer.stats.visitCount, color: 'text-white' },
                                        { label: 'Lần cuối', value: customer.stats.lastVisit ? new Date(customer.stats.lastVisit).toLocaleDateString('vi-VN') : 'Chưa có', color: 'text-white/80' },
                                        { label: 'Số dư ví', value: `${customer.stats.walletBalance.toLocaleString()} đ`, color: 'text-emerald-400' },
                                    ].map((stat, idx) => (
                                        <div key={idx} className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                                            <p className="text-[10px] uppercase font-bold text-white/40 mb-1 tracking-widest">{stat.label}</p>
                                            <p className={`text-[15px] font-black ${stat.color}`}>{stat.value}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* LỊCH SỬ DỊCH VỤ */}
                            <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
                                <div className="p-6 flex justify-between items-center border-b border-white/10 bg-white/5">
                                    <h3 className="font-bold text-white flex items-center gap-2 text-lg">
                                        <div className="p-1.5 bg-white/10 rounded-lg"><ClipboardList size={18} className="text-white/70" /></div>
                                        Lịch sử dịch vụ
                                    </h3>
                                    <button className="text-emerald-400 text-xs font-bold hover:text-emerald-300 transition-colors uppercase tracking-wider">Xem tất cả</button>
                                </div>
                                <div className="p-4">
                                    <ServiceHistory history={customer.history} hidePrice={isKTV} />
                                </div>
                            </div>

                            {/* GHI CHÚ NỘI BỘ */}
                            <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 shadow-2xl">
                                <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-white/40">Nhật ký chăm sóc khách hàng</h3>
                                <CustomerNotes
                                    notes={customer.notes}
                                    onAddNote={addNote}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* --- 7. MODAL CHỈNH SỬA (Thêm mới) --- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
                    <div
                        className="w-full max-w-md bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h3 className="text-xl font-bold text-white">Chỉnh sửa thông tin</h3>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleUpdate} className="p-6 space-y-5">
                            {/* Tên */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Họ và tên</label>
                                <div className="relative group">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                        value={editFormData.full_name}
                                        onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* SĐT */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Số điện thoại</label>
                                <div className="relative group">
                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-400" size={18} />
                                    <input
                                        type="tel"
                                        required
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                        value={editFormData.phone}
                                        onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-400" size={18} />
                                    <input
                                        type="email"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                        value={editFormData.email}
                                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 flex gap-3 border-t border-white/5 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl border border-white/10 text-white/70 text-sm font-bold hover:bg-white/5 hover:text-white transition-all"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 rounded-xl bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Scrollbar */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
            `}</style>
        </div>
    );
}