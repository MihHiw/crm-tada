import { Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';

export default function CustomerProfile({ customer }: { customer: any }) {
    return (
        <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-[#161D2F] rounded-[32px] p-8 border border-gray-800 flex flex-col items-center">
                <div className="relative w-32 h-32 mb-6">
                    <Image
                        src={customer.avatar}
                        alt={customer.name}
                        fill
                        className="rounded-full object-cover border-4 border-[#0B0F1A] shadow-xl"
                    />
                </div>
                <h2 className="text-xl font-bold mb-1">{customer.name}</h2>
                <p className="text-gray-500 text-sm mb-8">{customer.role}</p>

                <div className="w-full space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="p-2 bg-[#0B0F1A] rounded-lg text-blue-500"><Phone size={18} /></div>
                        {customer.phone}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="p-2 bg-[#0B0F1A] rounded-lg text-blue-500"><Mail size={18} /></div>
                        {customer.email}
                    </div>
                    <div className="flex items-start gap-3 text-sm text-gray-300">
                        <div className="p-2 bg-[#0B0F1A] rounded-lg text-blue-500 shrink-0"><MapPin size={18} /></div>
                        <span className="leading-relaxed">{customer.address}</span>
                    </div>
                </div>
            </div>

            {/* Metrics Card */}
            <div className="bg-[#161D2F] rounded-[32px] p-6 border border-gray-800">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Chỉ số tài chính</h3>
                <div className="grid grid-cols-2 gap-3">
                    <MetricItem label="Tài sản (AUM)" value={customer.metrics?.aum} />
                    <MetricItem label="Tín dụng" value={customer.metrics?.creditScore} color="text-green-500" />
                    <MetricItem label="Rủi ro" value={customer.metrics?.riskTolerance} color="text-yellow-500" />
                    <MetricItem label="Gói dịch vụ" value={customer.metrics?.servicePackage} />
                </div>
            </div>
        </div>
    );
}

function MetricItem({ label, value, color = "text-white" }: any) {
    return (
        <div className="bg-[#0B0F1A] p-4 rounded-2xl border border-gray-800/50">
            <p className="text-[10px] text-gray-500 mb-1 font-bold">{label}</p>
            <p className={`text-sm font-bold ${color}`}>{value || "---"}</p>
        </div>
    );
}