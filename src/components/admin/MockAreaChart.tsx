
export const MockAreaChart = () => (
    <div className="relative h-64 w-full mt-6">
        {/* Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-400/50">
            {[...Array(5)].map((_, i) => <div key={i} className="border-b border-dashed border-slate-100 w-full h-0"></div>)}
        </div>

        {/* Chart Area */}
        <div className="absolute inset-0 ml-8 h-full">
            <svg viewBox="0 0 100 40" className="w-full h-full drop-shadow-sm" preserveAspectRatio="none">
                {/* Doanh thu (Xanh dương) */}
                <path d="M0,40 L0,30 C15,35 25,20 40,25 C55,30 70,10 85,15 L100,5 L100,40 Z" fill="url(#blueGradient)" fillOpacity="0.3" />
                <path d="M0,30 C15,35 25,20 40,25 C55,30 70,10 85,15 L100,5" fill="none" stroke="#3b82f6" strokeWidth="0.8" />

                {/* Khách hàng (Xanh lá) */}
                <path d="M0,40 L0,35 C20,38 40,28 50,30 C70,32 85,20 100,18 L100,40 Z" fill="url(#greenGradient)" fillOpacity="0.2" />
                <path d="M0,35 C20,38 40,28 50,30 C70,32 85,20 100,18" fill="none" stroke="#22c55e" strokeWidth="0.8" strokeDasharray="2 1" />

                <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    </div>
);