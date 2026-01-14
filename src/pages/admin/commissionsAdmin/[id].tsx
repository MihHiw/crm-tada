"use client";

import { Sidebar } from "@/components/admin/Sidebar";
import { useTechCommissionByID } from "@/hooks/techCommission/useTechCommissionByID";
import { ArrowLeft, Calendar, Clock, DollarSign, ShieldCheck, User } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

const formatVND = (value: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

export default function CommissionDetailPage() {
    const router = useRouter();
    const params = useParams();

    // Lấy ID từ URL (Hỗ trợ cả format folder [id])
    const staffId = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const { profile, transactions, stats, loading } = useTechCommissionByID(staffId || null);

    if (!staffId) return <div className="p-10 text-center">Không tìm thấy mã định danh...</div>;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-600 flex">
            <Sidebar />

            <main className="flex-1 lg:ml-64 p-6 space-y-6">
                {/* Nút quay lại */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-4 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Quay lại danh sách
                </button>

                {loading ? (
                    <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-dashed border-slate-300">
                        <div className="animate-pulse flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                            <p className="text-slate-400">Đang tải dữ liệu nhân viên...</p>
                        </div>
                    </div>
                ) : profile ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* Header Profile */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4">
                            <div className="flex gap-4 items-center">
                                <div className="relative w-20 h-20">
                                    <Image
                                        src={profile.avatar || "https://i.pravatar.cc/150?u=guest"}
                                        alt={profile.name}
                                        fill
                                        className="rounded-full border-4 border-slate-50 object-cover shadow-sm"
                                        priority
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-2xl font-bold text-slate-900">{profile.name}</h1>
                                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                                            {profile.role}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 flex items-center gap-2 mt-1">
                                        <User size={14} />
                                        Liên hệ/ID: <span className="font-mono text-slate-900 font-medium">{profile.phone}</span>
                                    </p>
                                </div>
                            </div>
                            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 flex items-center gap-2 shadow-lg shadow-slate-200 transition-all active:scale-95">
                                <DollarSign size={18} /> Chốt lương & Thanh toán
                            </button>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm group hover:border-blue-200 transition-colors">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Tổng tích lũy</p>
                                <p className="text-3xl font-black text-slate-900">{formatVND(stats.totalCommission)}</p>
                            </div>
                            <div className="bg-emerald-500 p-6 rounded-xl shadow-md relative overflow-hidden group">
                                <ShieldCheck size={80} className="absolute -right-4 -bottom-4 text-white opacity-10 rotate-12" />
                                <p className="text-emerald-50 text-xs font-bold uppercase tracking-widest mb-2">Đã hoàn thành (Paid)</p>
                                <p className="text-3xl font-black text-white">{formatVND(stats.paidCommission)}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Chờ xử lý (Pending)</p>
                                <p className="text-3xl font-black text-orange-500">{formatVND(stats.pendingCommission)}</p>
                            </div>
                        </div>

                        {/* Bảng chi tiết dịch vụ */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Clock size={20} className="text-slate-400" /> Lịch sử chi tiết hoa hồng
                                </h3>
                                <div className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-md">
                                    {stats.jobCount} Giao dịch
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100 uppercase text-[11px] font-bold">
                                        <tr>
                                            <th className="px-6 py-4">Nội dung / Mã GD</th>
                                            <th className="px-6 py-4">Ngày ghi nhận</th>
                                            <th className="px-6 py-4 text-right">Hoa hồng</th>
                                            <th className="px-6 py-4 text-center">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {transactions.map((t) => (
                                            <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="font-semibold text-slate-800">
                                                        {t.serviceName || "Hoa hồng giới thiệu hệ thống"}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-mono mt-1">
                                                        {t.transactionCode || "REF-SYSTEM"}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    <div className="flex items-center gap-1.5 font-medium">
                                                        <Calendar size={14} /> {t.joinedDate}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="font-bold text-slate-900 text-base">
                                                        {formatVND(t.commission)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${t.status === "completed"
                                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                            : "bg-orange-50 text-orange-600 border-orange-100"
                                                        }`}>
                                                        {t.status === "completed" ? "Thành công" : "Đang chờ"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {transactions.length === 0 && (
                                <div className="p-20 text-center">
                                    <div className="inline-flex p-4 rounded-full bg-slate-50 mb-4">
                                        <Clock size={32} className="text-slate-200" />
                                    </div>
                                    <p className="text-slate-400 font-medium">Chưa có lịch sử giao dịch nào.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-20 bg-white rounded-xl border">
                        <p className="text-slate-500">Không tìm thấy thông tin nhân viên này.</p>
                        <button onClick={() => router.back()} className="mt-4 text-blue-600 font-bold">Quay lại</button>
                    </div>
                )}
            </main>
        </div>
    );
}