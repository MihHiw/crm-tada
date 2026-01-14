import { LucideIcon, Minus, TrendingDown, TrendingUp } from "lucide-react";
import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    subtext: string;
    trend: 'up' | 'down' | 'neutral'; // Chỉ chấp nhận 3 giá trị này
    icon: LucideIcon; // Kiểu dữ liệu cho Icon của Lucide
    colorClass: string; // Class màu nền cho icon chính (VD: text-rose-500 bg-rose-50)
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    subtext,
    trend,
    icon: Icon,
    colorClass
}) => {

    // Logic xác định màu sắc và icon hiển thị dựa trên trend
    const trendConfig = {
        up: {
            style: "bg-emerald-50 text-emerald-600",
            Icon: TrendingUp
        },
        down: {
            style: "bg-rose-50 text-rose-600",
            Icon: TrendingDown
        },
        neutral: {
            style: "bg-slate-100 text-slate-500",
            Icon: Minus
        }
    };

    const { style, Icon: TrendIcon } = trendConfig[trend];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100 hover:shadow-md transition-shadow duration-300 group h-full flex flex-col justify-between">

            {/* Phần trên: Số liệu và Icon chính */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-3xl font-bold text-slate-800 group-hover:text-rose-600 transition-colors duration-300">
                        {value}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                        {title}
                    </p>
                </div>

                {/* Icon chính với background màu */}
                <div className={`p-3 rounded-xl ${colorClass} bg-opacity-20 transition-transform group-hover:scale-110`}>
                    <Icon size={22} />
                </div>
            </div>

            {/* Phần dưới: Badge hiển thị xu hướng */}
            <div className={`inline-flex items-center self-start px-2.5 py-1 rounded-md text-xs font-medium ${style}`}>
                <TrendIcon size={14} className="mr-1.5" />
                {subtext}
            </div>
        </div>
    );
};

export default StatCard;