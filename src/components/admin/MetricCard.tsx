import { LucideIcon } from "lucide-react";
import React from "react";

interface MetricCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
    subText: string;
    subTextColor: string;
    iconColor: string; // e.g., "text-blue-600 bg-blue-600"
    trendIcon?: LucideIcon;
}

export const MetricCard: React.FC<MetricCardProps> = ({
    icon: Icon, label, value, subText, subTextColor, iconColor, trendIcon: TrendIcon
}) => (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col justify-between h-full hover:border-blue-100 transition-colors">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
                <p className="text-slate-500 text-sm font-medium mt-1">{label}</p>
            </div>
            {/* Note: Tailwind dynamic classes handling requires full class names or safelist */}
            <div className={`p-3 rounded-xl ${iconColor} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${iconColor.split(' ')[0]}`} />
            </div>
        </div>
        <div className={`flex items-center text-xs font-semibold ${subTextColor} bg-slate-50 w-fit px-2 py-1 rounded-md`}>
            {TrendIcon && <TrendIcon className="w-3.5 h-3.5 mr-1.5" />}
            {subText}
        </div>
    </div>
);