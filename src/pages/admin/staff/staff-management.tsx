"use client";

import { Sidebar } from '@/components/admin/Sidebar';
import GlobalBackground from '@/components/GlobalBackground';
import { StaffUI, useStaff } from '@/hooks/staff/useStaff';
import {
    Briefcase,
    Mail, MapPin,
    Pencil,
    Phone,
    Plus,
    Search,
    Star,
    Trash2,
    Trophy, Users, X
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';


export default function StaffManagement() {
    const router = useRouter();
    const {
        staffs,
        selectedStaff,
        searchTerm,
        filterStatus,
        handleSearch,
        handleFilterStatus,
        stats,
        addStaff,
        updateStaff,
        deleteStaff,
        selectStaff
    } = useStaff();

    // --- States cho Modal ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffUI | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        role: 'Kỹ thuật viên',
        status: 'Đang làm việc' as StaffUI['status'],
        email: '',
        address: 'Hồ Chí Minh'
    });

    // --- Handlers ---
    const handleNavigateDetail = (id: string) => {
        router.push(`/admin/staffAdmin/${id}`);
    };

    const openAddModal = () => {
        setEditingStaff(null);
        setFormData({ name: '', phone: '', role: 'Kỹ thuật viên', status: 'Đang làm việc', email: '', address: 'Hồ Chí Minh' });
        setIsModalOpen(true);
    };

    const openEditModal = (e: React.MouseEvent, staff: StaffUI) => {
        e.stopPropagation();
        setEditingStaff(staff);
        setFormData({
            name: staff.name,
            phone: staff.phone,
            role: staff.role,
            status: staff.status,
            email: staff.email,
            address: staff.address
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingStaff) {
            updateStaff(editingStaff.id, formData);
        } else {
            addStaff({
                ...formData,
                subRole: 'Staff',
                commission: '0',
                rating: 5.0,
                avatar: `https://ui-avatars.com/api/?name=${formData.name}`,
                target: { current: '0tr', max: '50tr', percent: 0 }
            });
        }
        setIsModalOpen(false);
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
            deleteStaff(id);
        }
    };

    return (
        // ROOT: Dark Mode + Glass
        <div className="flex h-screen w-full overflow-hidden font-sans text-white">
            <GlobalBackground />

            {/* Sidebar Glass */}
            <div className="w-[260px] flex-shrink-0 h-full border-r border-white/10 bg-slate-900/60 backdrop-blur-xl z-20">
                <Sidebar />
            </div>

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10 scrollbar-hide">
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">

                    {/* Header */}
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">Đội ngũ nhân viên</h1>
                            <p className="text-white/60 text-sm font-medium mt-1">Quản lý hồ sơ và hiệu suất làm việc.</p>
                        </div>



                        <button
                            onClick={openAddModal}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
                        >
                            <Plus size={18} /> Thêm nhân sự
                        </button>
                    </div>

                    {/* Top Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            title="Tổng nhân sự"
                            value={stats.total.toString()}
                            sub="Toàn hệ thống"
                            icon={<Users className="text-emerald-400" />}
                        />
                        <StatCard
                            title="Đang trực"
                            value={stats.active.toString()}
                            sub={`${stats.off} nhân viên nghỉ`}
                            icon={<Briefcase className="text-blue-400" />}
                        />
                        <StatCard
                            title="Hiệu suất cao nhất"
                            value={staffs[0]?.name || "N/A"}
                            sub={`${staffs[0]?.commission || 0} đ`}
                            icon={<Trophy className="text-amber-400" />}
                        />
                    </div>

                    <div className="flex flex-col xl:flex-row gap-6 items-start h-full">
                        {/* Main Table Container (Glass) */}
                        <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/10 overflow-hidden flex flex-col min-h-[500px]">

                            {/* Toolbar */}
                            <div className="p-6 flex flex-col md:flex-row gap-4 border-b border-white/5">
                                <div className="relative flex-1 group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-400 transition-colors" size={18} />
                                    <input
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        placeholder="Tìm kiếm tên hoặc mã nhân viên..."
                                        className="w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-2xl text-sm text-white placeholder-white/30 outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                    />
                                </div>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => handleFilterStatus(e.target.value)}
                                    className="bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white outline-none cursor-pointer font-bold focus:ring-1 focus:ring-emerald-500/50 appearance-none"
                                >
                                    <option value="Tất cả" className="bg-slate-800">Tất cả trạng thái</option>
                                    <option value="Đang làm việc" className="bg-slate-800">Đang làm việc</option>
                                    <option value="Đang nghỉ" className="bg-slate-800">Đang nghỉ</option>
                                    <option value="Tạm vắng" className="bg-slate-800">Tạm vắng</option>
                                </select>
                            </div>

                            <div className="flex-1 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#0f172a]/80 text-[10px] font-black text-white/50 uppercase tracking-widest border-b border-white/10 backdrop-blur-md">
                                        <tr>
                                            <th className="px-6 py-5">Nhân viên</th>
                                            <th className="py-5">Vai trò</th>
                                            <th className="py-5 text-center">Trạng thái</th>
                                            <th className="py-5">Hoa hồng tháng</th>
                                            <th className="py-5">Đánh giá</th>
                                            <th className="px-6 py-5 text-right">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {staffs.map((staff) => (
                                            <tr
                                                key={staff.id}
                                                onClick={() => handleNavigateDetail(staff.id)}
                                                onMouseEnter={() => selectStaff(staff.id)}
                                                className={`cursor-pointer group hover:bg-white/5 transition-all ${selectedStaff?.id === staff.id ? 'bg-emerald-500/10' : ''}`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative size-10 shrink-0 rounded-full overflow-hidden border border-white/20">
                                                            <Image src={staff.avatar} alt="" fill className="object-cover" unoptimized />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">{staff.name}</p>
                                                            <p className="text-[10px] text-white/50 font-mono mt-0.5">ID: {staff.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-[11px] font-bold text-white/70 uppercase tracking-wide">{staff.role}</td>
                                                <td className="py-4 text-center"><StatusBadge status={staff.status} /></td>
                                                <td className="py-4 font-black text-sm text-emerald-400">{staff.commission} đ</td>
                                                <td className="py-4">
                                                    <div className="flex items-center gap-1 text-sm font-black text-amber-400">
                                                        {staff.rating.toFixed(1)} <Star size={14} fill="currentColor" />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={(e) => openEditModal(e, staff)} className="p-2 hover:bg-white/10 text-blue-400 rounded-lg transition-colors"><Pencil size={16} /></button>
                                                        <button onClick={(e) => handleDelete(e, staff.id)} className="p-2 hover:bg-white/10 text-rose-400 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Right Detail Panel (Glass) */}
                        <aside className="w-full xl:w-[360px] shrink-0 space-y-6">
                            {selectedStaff ? (
                                <div className="bg-white/5 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/10 p-8 sticky top-0 animate-in fade-in slide-in-from-right-8">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="relative size-24 rounded-[2rem] overflow-hidden border-4 border-white/10 mb-4 shadow-lg">
                                            <Image src={selectedStaff.avatar} alt="" fill className="object-cover" unoptimized />
                                        </div>
                                        <h3 className="text-xl font-black text-white tracking-tight">{selectedStaff.name}</h3>
                                        <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-6">{selectedStaff.subRole} • {selectedStaff.role}</p>

                                        <div className="grid grid-cols-2 gap-3 w-full">
                                            <button onClick={(e) => openEditModal(e, selectedStaff)} className="bg-white/10 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all border border-white/5">Hồ sơ</button>
                                            <button className="bg-emerald-500 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">Liên hệ</button>
                                        </div>
                                    </div>

                                    <div className="mt-8 space-y-4">
                                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] px-1">Thông tin cá nhân</h4>
                                        <ContactItem icon={<Phone size={14} />} text={selectedStaff.phone} />
                                        <ContactItem icon={<Mail size={14} />} text={selectedStaff.email} />
                                        <ContactItem icon={<MapPin size={14} />} text={selectedStaff.address} />
                                    </div>

                                    <div className="mt-8">
                                        <div className="flex justify-between items-end mb-4 px-1">
                                            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Chỉ tiêu tháng</h4>
                                            <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">{selectedStaff.target.percent}%</span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-xs font-bold">
                                                <p className="text-white/80">Doanh thu đạt được</p>
                                                <p className="text-white/40">{selectedStaff.target.current} / {selectedStaff.target.max}</p>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${selectedStaff.target.percent}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center p-10 border border-dashed border-white/10 rounded-[32px] bg-white/5">
                                    <p className="text-white/30 text-sm font-medium italic">Chọn nhân viên để xem chi tiết</p>
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </main>

            {/* MODAL (Dark Glass) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-[#1e293b] w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
                        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div>
                                <h2 className="text-xl font-black text-white tracking-tight">{editingStaff ? 'Cập nhật nhân sự' : 'Thêm nhân sự mới'}</h2>
                                <p className="text-[10px] text-white/40 font-bold mt-1 uppercase tracking-widest">Hệ thống quản lý nội bộ</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all"><X size={20} /></button>
                        </div>

                        <form className="p-8 space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Họ tên nhân viên</label>
                                    <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-black/30 border border-white/10 rounded-2xl outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-bold text-white placeholder-white/20"
                                        placeholder="Nhập họ tên đầy đủ..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Số điện thoại</label>
                                    <input required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-black/30 border border-white/10 rounded-2xl outline-none focus:border-emerald-500/50 transition-all font-bold text-white"
                                        placeholder="090..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Vai trò chính</label>
                                    <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-black/30 border border-white/10 rounded-2xl outline-none focus:border-emerald-500/50 transition-all font-bold text-white cursor-pointer appearance-none">
                                        <option className="bg-slate-800">Kỹ thuật viên</option>
                                        <option className="bg-slate-800">Lễ tân</option>
                                        <option className="bg-slate-800">Quản trị viên</option>
                                        <option className="bg-slate-800">Sale / Tư vấn</option>
                                    </select>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Địa chỉ Email</label>
                                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-black/30 border border-white/10 rounded-2xl outline-none focus:border-emerald-500/50 transition-all font-bold text-white"
                                        placeholder="nhanvien@vanillaspa.com" />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 font-black text-white/40 uppercase tracking-[0.2em] text-xs hover:text-white hover:bg-white/5 rounded-xl transition-all">Hủy bỏ</button>
                                <button type="submit" className="flex-[2] py-3.5 bg-emerald-600 font-black text-white rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 uppercase tracking-[0.2em] text-xs">
                                    {editingStaff ? 'Cập nhật ngay' : 'Xác nhận thêm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}</style>
        </div>
    );
}

// --- Sub-components (Dark Mode) ---
function StatCard({ title, value, sub, icon }: { title: string; value: string; sub: string; icon: ReactNode }) {
    return (
        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] shadow-lg border border-white/10 flex justify-between items-center transition-all hover:bg-white/10 hover:-translate-y-1">
            <div className="space-y-1">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">{title}</p>
                <h3 className="text-3xl font-black text-white leading-tight">{value}</h3>
                <p className={`text-[11px] font-bold ${sub.includes('+') ? 'text-emerald-400' : 'text-white/40'}`}>{sub}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl shadow-inner text-white">{icon}</div>
        </div>
    );
}

function StatusBadge({ status }: { status: StaffUI['status'] }) {
    const styles = {
        'Đang làm việc': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        'Đang nghỉ': 'bg-white/10 text-white/50 border-white/10',
        'Tạm vắng': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    }[status];
    return (
        <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wide border ${styles}`}>
            ● {status}
        </span>
    );
}

function ContactItem({ icon, text }: { icon: ReactNode; text: string }) {
    return (
        <div className="flex items-center gap-4 px-4 py-3 bg-black/20 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-black/30 transition-all cursor-pointer group">
            <div className="text-white/40 group-hover:text-emerald-400 transition-colors shrink-0">{icon}</div>
            <span className="text-xs font-bold text-white/80 group-hover:text-white truncate">{text || 'N/A'}</span>
        </div>
    );
}