import React from 'react';

// Định nghĩa các màu được phép sử dụng
type ButtonColor = 'green' | 'red' | 'blue' | 'gray';

interface ActionButtonProps {
    onClick: () => void;
    icon: React.ReactNode;
    color?: ButtonColor; // Dấu ? nghĩa là không bắt buộc (mặc định sẽ là gray)
    title?: string;      // Tooltip khi hover
}

const ActionButton: React.FC<ActionButtonProps> = ({
    onClick,
    icon,
    color = 'gray', // Giá trị mặc định nếu không truyền color
    title
}) => {

    // Map màu sắc với các class Tailwind tương ứng
    const colorClasses: Record<ButtonColor, string> = {
        green: 'bg-green-50 text-green-600 hover:bg-green-100',
        red: 'bg-red-50 text-red-500 hover:bg-red-100',
        blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
        gray: 'bg-gray-50 text-gray-500 hover:bg-gray-100',
    };

    return (
        <button
            onClick={onClick}
            title={title}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${colorClasses[color]}`}
        >
            {icon}
        </button>
    );
};

export default ActionButton;