"use client";
import { Award, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';

export default function CustomerProfile({ customer }: { customer: any }) {
    // Logic xử lý hiển thị địa chỉ để tránh render Object gây lỗi
    const renderAddress = () => {
        if (!customer.address) return "Địa chỉ chưa cập nhật";

        // Nếu address là string (dữ liệu cũ) thì hiện luôn
        if (typeof customer.address === 'string') return customer.address;

        // Nếu address là Object (dữ liệu mới), nối các trường lại thành chuỗi
        const { detail, city, province, region } = customer.address;
        const parts = [detail, city, province].filter(Boolean);
        return parts.length > 0 ? `${parts.join(', ')} (${region})` : region;
    };

    return (
        <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-[#161D2F] rounded-[32px] p-8 border border-gray-800 flex flex-col items-center shadow-xl">
                <div className="relative w-32 h-32 mb-6">
                    <Image
                        src={customer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'}
                        alt={customer.name}
                        fill
                        className="rounded-full object-cover border-4 border-[#0B0F1A] shadow-2xl"
                    />
                    {customer.isVip && (
                        <div className="absolute -bottom-2 right-2 bg-yellow-500 p-1.5 rounded-full border-2 border-[#0B0F1A] shadow-lg">
                            <Award size={16} className="text-[#0B0F1A]" />
                        </div>
                    )}
                </div>

                <h2 className="text-xl font-bold mb-1 text-white">{customer.name}</h2>
                <p className="text-emerald-500 text-xs font-bold uppercase tracking-wider mb-8 bg-emerald-500/10 px-3 py-1 rounded-full">
                    {customer.role}
                </p>

                <div className="w-full space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-300 group">
                        <div className="p-2 bg-[#0B0F1A] rounded-lg text-emerald-500 group-hover:bg-emerald-500/10 transition-all">
                            <Phone size={18} />
                        </div>
                        <span className="font-medium">{customer.phone}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-300 group">
                        <div className="p-2 bg-[#0B0F1A] rounded-lg text-emerald-500 group-hover:bg-emerald-500/10 transition-all">
                            <Mail size={18} />
                        </div>
                        <span className="truncate font-medium">{customer.email}</span>
                    </div>

                    <div className="flex items-start gap-3 text-sm text-gray-300 group">
                        <div className="p-2 bg-[#0B0F1A] rounded-lg text-emerald-500 shrink-0 group-hover:bg-emerald-500/10 transition-all">
                            <MapPin size={18} />
                        </div>
                        {/* FIX: Không render customer.address trực tiếp */}
                        <span className="leading-relaxed text-gray-400">
                            {renderAddress()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Metrics Card */}
            <div className="bg-[#161D2F] rounded-[32px] p-6 border border-gray-800">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Chỉ số tín dụng</h3>
                <div className="grid grid-cols-2 gap-3">
                    <MetricItem
                        label="Dư nợ thực tế"
                        value={customer.metrics?.currentDebt}
                        color="text-red-400"
                    />
                    <MetricItem
                        label="Điểm tín dụng"
                        value={customer.metrics?.creditScore}
                        color="text-blue-400"
                    />
                    <MetricItem
                        label="Số lần đã vay"
                        value={`${customer.products?.length || 0} lần`}
                        color="text-emerald-500"
                    />
                    <MetricItem
                        label="Tổng gốc đã vay"
                        value={customer.metrics?.totalLoan}
                        color="text-white"
                    />
                </div>
            </div>
        </div>
    );
}

function MetricItem({ label, value, color = "text-white" }: { label: string, value: string | undefined, color?: string }) {
    return (
        <div className="bg-[#0B0F1A] p-4 rounded-2xl border border-gray-800/50 hover:border-gray-700 transition-all">
            <p className="text-[9px] text-gray-500 mb-1 font-bold uppercase">{label}</p>
            <p className={`text-sm font-bold ${color}`}>{value || "---"}</p>
        </div>
    );
}