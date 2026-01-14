
interface MenuItemProps {
    icon: string;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

const MenuItem = ({ icon, label, active = false, onClick }: MenuItemProps) => {

    // Helper function để render SVG path dựa trên tên icon
    const renderIconPath = () => {
        switch (icon) {
            case 'chart':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />;
            case 'service':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />;
            case 'calendar':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />;
            case 'history':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
            case 'users':
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />;
            default:
                // Mặc định (Menu burger)
                return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />;
        }
    };

    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${active
                    ? 'bg-[#E3E8EF] text-[#A33446] font-bold border-l-4 border-[#A33446]'
                    : 'text-gray-500 hover:bg-white hover:text-gray-800'
                }`}
        >
            <svg
                className={`w-5 h-5 flex-shrink-0 ${active ? 'text-[#A33446]' : 'text-gray-400'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                {renderIconPath()}
            </svg>
            <span className="text-sm truncate">{label}</span>
        </div>
    );
};

export default MenuItem;