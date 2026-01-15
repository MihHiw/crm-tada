"use client";
import { Search } from 'lucide-react';

interface CustomerToolbarProps {
    filterTier: string;
    setFilterTier: (tier: string) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export default function CustomerToolbar({ filterTier, setFilterTier, searchTerm, setSearchTerm }: CustomerToolbarProps) {
    const tiers = ['Tất cả', 'Thành Viên', 'Bạc', 'Vàng', 'Diamond'];

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Tabs trong suốt */}
            <div className="flex bg-black/20 p-1 rounded-xl border border-white/5 overflow-x-auto max-w-full">
                {tiers.map((tier) => (
                    <button
                        key={tier}
                        onClick={() => setFilterTier(tier === 'Tất cả' ? '' : tier)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${(tier === 'Tất cả' && filterTier === '') || filterTier === tier
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {tier}
                    </button>
                ))}
            </div>

            {/* Input tìm kiếm trong suốt */}
            <div className="relative w-full md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm tên, số điện thoại..."
                    className="w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
            </div>
        </div>
    );
}