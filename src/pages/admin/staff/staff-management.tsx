"use client";

import { Sidebar } from '@/components/admin/Sidebar';
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
        staffs,          // Danh sách đã lọc từ Hook
        selectedStaff,   // Nhân viên đang được chọn xem chi tiết
        searchTerm,
        filterStatus,
        handleSearch,
        handleFilterStatus,
        stats,           // Thống kê đếm từ Hook
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
            // Khớp với interface StaffUI yêu cầu bởi addStaff
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
        <div className="flex h-screen bg-[#F0F7F4] text-slate-800 font-sans">
            <aside className="w-64 bg-white border-r border-slate-100 shrink-0">
                <Sidebar />
            </aside>

            <main className="flex-1 overflow-y-auto p-6 space-y-6 lg:ml-0">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <nav className="text-xs text-slate-400 mb-1">Hệ thống / Quản trị nhân sự</nav>
                        <h1 className="text-2xl font-bold text-slate-900">Đội ngũ nhân viên</h1>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="bg-[#00E676] hover:bg-[#00c853] text-slate-900 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95"
                    >
                        <Plus size={18} /> Thêm nhân sự
                    </button>
                </div>

                {/* Top Stats - Lấy từ Hook */}
                <div className="grid grid-cols-3 gap-6">
                    <StatCard title="Tổng nhân sự" value={stats.total.toString()} sub="Toàn hệ thống" icon={<Users className="text-emerald-500" />} />
                    <StatCard title="Đang trực" value={stats.active.toString()} sub={`${stats.off} nhân viên nghỉ`} icon={<Briefcase className="text-blue-500" />} />
                    <StatCard title="Hiệu suất cao nhất" value={staffs[0]?.name || "N/A"} sub={`${staffs[0]?.commission || 0} đ`} icon={<Trophy className="text-orange-500" />} />
                </div>

                <div className="flex gap-6 items-start">
                    <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-4 flex gap-3 border-b border-slate-50">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Tìm kiếm tên hoặc mã nhân viên..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 ring-emerald-500/20"
                                />
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => handleFilterStatus(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none cursor-pointer font-bold text-slate-600"
                            >
                                <option value="Tất cả">Tất cả trạng thái</option>
                                <option value="Đang làm việc">Đang làm việc</option>
                                <option value="Đang nghỉ">Đang nghỉ</option>
                                <option value="Tạm vắng">Tạm vắng</option>
                            </select>
                        </div>

                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Nhân viên</th>
                                    <th className="py-4">Vai trò</th>
                                    <th className="py-4 text-center">Trạng thái</th>
                                    <th className="py-4">Hoa hồng tháng</th>
                                    <th className="py-4">Đánh giá</th>
                                    <th className="px-6 py-4 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {staffs.map((staff) => (
                                    <tr
                                        key={staff.id}
                                        onClick={() => handleNavigateDetail(staff.id)}
                                        onMouseEnter={() => selectStaff(staff.id)}
                                        className={`cursor-pointer group hover:bg-slate-50/80 transition-all ${selectedStaff?.id === staff.id ? 'bg-emerald-50/40' : ''}`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative size-10 shrink-0">
                                                    <Image src={staff.avatar} alt="" fill className="rounded-2xl object-cover border border-slate-100 shadow-sm" unoptimized />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-slate-800 leading-tight">{staff.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium">ID: {staff.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-[11px] font-bold text-slate-500 uppercase tracking-tight">{staff.role}</td>
                                        <td className="py-4 text-center"><StatusBadge status={staff.status} /></td>
                                        <td className="py-4 font-black text-sm text-emerald-600">{staff.commission} đ</td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-1 text-sm font-black text-amber-500">
                                                {staff.rating.toFixed(1)} <Star size={14} fill="currentColor" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={(e) => openEditModal(e, staff)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors"><Pencil size={16} /></button>
                                                <button onClick={(e) => handleDelete(e, staff.id)} className="p-2 hover:bg-rose-50 text-rose-600 rounded-xl transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Right Detail Panel - Dữ liệu động từ Hook */}
                    <aside className="w-[360px] space-y-6 shrink-0">
                        {selectedStaff && (
                            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 sticky top-6 animate-in fade-in slide-in-from-right-4">
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative size-24 rounded-[2rem] overflow-hidden border-4 border-emerald-50 mb-4 shadow-md">
                                        <Image src={selectedStaff.avatar} alt="" fill className="object-cover" unoptimized />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{selectedStaff.name}</h3>
                                    <p className="text-xs text-emerald-600 font-black uppercase tracking-widest mb-6">{selectedStaff.subRole} • {selectedStaff.role}</p>
                                    
                                    <div className="grid grid-cols-2 gap-3 w-full">
                                        <button onClick={(e) => openEditModal(e, selectedStaff)} className="bg-slate-900 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95">Hồ sơ</button>
                                        <button className="bg-emerald-50 text-emerald-700 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-100 transition-all active:scale-95">Liên hệ</button>
                                    </div>
                                </div>

                                <div className="mt-10 space-y-5">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Thông tin cá nhân</h4>
                                    <ContactItem icon={<Phone size={14} />} text={selectedStaff.phone} />
                                    <ContactItem icon={<Mail size={14} />} text={selectedStaff.email} />
                                    <ContactItem icon={<MapPin size={14} />} text={selectedStaff.address} />
                                </div>

                                <div className="mt-10">
                                    <div className="flex justify-between items-end mb-4 px-1">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Chỉ tiêu tháng</h4>
                                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">{selectedStaff.target.percent}%</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs font-black">
                                            <p className="text-slate-800 tracking-tight">Doanh thu đạt được</p>
                                            <p className="text-slate-400">{selectedStaff.target.current} / {selectedStaff.target.max}</p>
                                        </div>
                                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                            <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-1000 ease-out" style={{ width: `${selectedStaff.target.percent}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </main>

            {/* MODAL THÊM/SỬA */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editingStaff ? 'Cập nhật nhân sự' : 'Thêm nhân sự mới'}</h2>
                                <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">Hệ thống quản lý nội bộ</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full text-slate-400 transition-all"><X size={24} /></button>
                        </div>

                        <form className="p-8 space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Họ tên nhân viên</label>
                                    <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-emerald-500/20 focus:ring-4 ring-emerald-500/5 transition-all font-bold"
                                        placeholder="Nhập họ tên đầy đủ..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                                    <input required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-emerald-500/20 transition-all font-bold"
                                        placeholder="090..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vai trò chính</label>
                                    <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-emerald-500/20 transition-all font-bold cursor-pointer">
                                        <option>Kỹ thuật viên</option>
                                        <option>Lễ tân</option>
                                        <option>Quản trị viên</option>
                                        <option>Sale / Tư vấn</option>
                                    </select>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Địa chỉ Email</label>
                                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-emerald-500/20 transition-all font-bold"
                                        placeholder="nhanvien@vanillaspa.com" />
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-black text-slate-400 uppercase tracking-[0.2em] text-xs hover:text-slate-600 transition-colors">Hủy bỏ</button>
                                <button type="submit" className="flex-[2] py-4 bg-emerald-500 font-black text-white rounded-2xl hover:bg-emerald-600 shadow-xl shadow-emerald-200 transition-all active:scale-95 uppercase tracking-[0.2em] text-xs">
                                    {editingStaff ? 'Cập nhật ngay' : 'Xác nhận thêm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Sub-components giữ nguyên thiết kế của bạn nhưng dùng Type an toàn ---
function StatCard({ title, value, sub, icon }: { title: string; value: string; sub: string; icon: ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-center transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
                <h3 className="text-3xl font-black text-slate-900 leading-tight">{value}</h3>
                <p className={`text-[11px] font-bold ${sub.includes('+') ? 'text-emerald-500' : 'text-slate-400'}`}>{sub}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl shadow-inner">{icon}</div>
        </div>
    );
}

function StatusBadge({ status }: { status: StaffUI['status'] }) {
    const styles = {
        'Đang làm việc': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'Đang nghỉ': 'bg-slate-100 text-slate-500 border-slate-200',
        'Tạm vắng': 'bg-amber-50 text-amber-600 border-amber-100',
    }[status];
    return (
        <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tighter border ${styles}`}>
            ● {status}
        </span>
    );
}

function ContactItem({ icon, text }: { icon: ReactNode; text: string }) {
    return (
        <div className="flex items-center gap-4 px-4 py-3.5 bg-slate-50 rounded-2xl border border-transparent hover:border-emerald-100 hover:bg-white transition-all cursor-pointer group">
            <div className="text-slate-400 group-hover:text-emerald-500 transition-colors shrink-0">{icon}</div>
            <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 truncate">{text || 'N/A'}</span>
        </div>
    );
}