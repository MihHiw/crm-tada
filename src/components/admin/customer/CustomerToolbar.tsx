// src/components/admin/customers/CustomerToolbar.tsx
import { Search } from 'lucide-react';

interface CustomerToolbarProps {
    filterTier: string;
    setFilterTier: (tier: string) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const CustomerToolbar = ({ filterTier, setFilterTier, searchTerm, setSearchTerm }: CustomerToolbarProps) => {

    const tiers = [
        { id: 'all', label: 'Tất cả' },
        { id: 'Thành viên', label: 'Thành Viên' },
        { id: 'Hạng Bạc', label: 'Bạc' },
        { id: 'Hạng Vàng', label: 'Vàng' },
        { id: 'Hạng Kim Cương', label: 'Diamond' },
    ];

    return (
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white z-20">
            {/* Filter Tabs */}
            <div className="flex bg-gray-100/80 p-1 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar">
                {tiers.map((tier) => (
                    <button
                        key={tier.id}
                        onClick={() => setFilterTier(tier.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                            // So sánh filterTier với tier.id (giá trị thực tế trong data)
                            filterTier.toLowerCase() === tier.id.toLowerCase()
                                ? 'bg-white text-gray-800 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                            }`}
                    >
                        {tier.label}
                    </button>
                ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80 group">
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-400 transition-colors"
                    size={18}
                />
                <input
                    type="text"
                    placeholder="Tìm tên, số điện thoại..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/30 focus:bg-white focus:outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-100 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    );
};

export default CustomerToolbar;