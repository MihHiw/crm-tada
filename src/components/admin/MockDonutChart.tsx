import React from "react";

export const MockDonutChart = () => (
  <div className="relative flex items-center justify-center py-8">
    {/* Chart Ring */}
    <div className="w-52 h-52 rounded-full relative shadow-inner"
      style={{ background: 'conic-gradient(#3b82f6 0% 65%, #f59e0b 65% 85%, #ef4444 85% 100%)' }}>
      <div className="absolute inset-8 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
        <span className="text-3xl font-bold text-slate-800">1,240</span>
        <span className="text-xs text-slate-400 font-medium uppercase mt-1">Tổng lịch hẹn</span>
      </div>
    </div>
  </div>
);