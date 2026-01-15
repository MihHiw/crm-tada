import React from 'react';

// Định nghĩa các màu được phép sử dụng
export type StatCardColor = 'rose' | 'yellow' | 'green' | 'blue' | 'purple' | 'indigo' | 'orange';

interface StatCardProps {
    icon: React.ReactNode;      // Icon từ lucide-react
    color?: StatCardColor;      // Màu sắc (mặc định là rose)
    label: string;              // Tiêu đề nhỏ (VD: TỔNG LỊCH)
    value: string | number;     // Số liệu chính (VD: 12, 1.500.000 đ)
    subtext?: string;           // (Tùy chọn) Dòng chữ nhỏ bên dưới
}

const StatCard: React.FC<StatCardProps> = ({
    icon,
    color = 'rose',
    label,
    value,
    subtext
}) => {

    // UPDATE: Chuyển sang bảng màu Neon/Pastel trên nền trong suốt (bg-opacity/20)
    // để nổi bật trên nền tối (Dark Mode)
    const colorClasses: Record<StatCardColor, string> = {
        rose: "bg-rose-500/20 text-rose-300",
        yellow: "bg-amber-500/20 text-amber-300", // Dùng amber nhìn rõ hơn yellow trên nền tối
        green: "bg-emerald-500/20 text-emerald-300",
        blue: "bg-blue-500/20 text-blue-300",
        purple: "bg-purple-500/20 text-purple-300",
        indigo: "bg-indigo-500/20 text-indigo-300",
        orange: "bg-orange-500/20 text-orange-300",
    };

    return (
        // UPDATE: Container dùng bg-white/5 (kính mờ), border-white/10
        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[24px] border border-white/10 shadow-lg flex items-center gap-4 w-full transition-all hover:bg-white/10 hover:scale-[1.02]">

            {/* Icon Box */}
            <div className={`p-4 rounded-2xl flex items-center justify-center shadow-inner ${colorClasses[color]}`}>
                {icon}
            </div>

            {/* Content */}
            <div className="min-w-0">
                {/* Label: text-white/60 */}
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest truncate">
                    {label}
                </p>

                {/* Value: text-white */}
                <p className="text-2xl font-bold text-white mt-1 tracking-tight truncate">
                    {value}
                </p>

                {/* Subtext: text-white/50 */}
                {subtext && (
                    <p className="text-xs text-white/50 mt-1 font-medium truncate">
                        {subtext}
                    </p>
                )}
            </div>
        </div>
    );
};

export default StatCard;