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

    // Map màu sắc với các class Tailwind
    const colorClasses: Record<StatCardColor, string> = {
        rose: "bg-rose-50 text-rose-500",
        yellow: "bg-yellow-50 text-yellow-600",
        green: "bg-green-50 text-green-600",
        blue: "bg-blue-50 text-blue-600",     // Đã sửa lại text thành blue
        purple: "bg-purple-50 text-purple-600",
        indigo: "bg-indigo-50 text-indigo-600",
        orange: "bg-orange-50 text-orange-600",
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 w-full transition-all hover:shadow-md">
            {/* Icon Box */}
            <div className={`p-4 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
                {icon}
            </div>

            {/* Content */}
            <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                    {label}
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                    {value}
                </p>

                {/* Chỉ hiển thị nếu có subtext */}
                {subtext && (
                    <p className="text-xs text-gray-400 mt-1 font-medium">
                        {subtext}
                    </p>
                )}
            </div>
        </div>
    );
};

export default StatCard;