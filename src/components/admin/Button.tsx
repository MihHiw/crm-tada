import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "ghost" | "icon";
    size?: "default" | "sm" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
    className = "",
    variant = "default",
    size = "default", // Biến này bây giờ sẽ được sử dụng bên dưới
    ...props
}) => {
    // 1. Định nghĩa style cho từng variant
    const variants: Record<string, string> = {
        default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
        ghost: "hover:bg-slate-100 hover:text-slate-900 text-slate-500",
        icon: "h-10 w-10 p-2"
    };

    // 2. Định nghĩa style cho từng size (Giải quyết lỗi 'size' unused)
    const sizes: Record<string, string> = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-lg",
    };

    // Nếu variant là 'icon', chúng ta có thể bỏ qua padding của size để nút vuông vắn
    const sizeClass = variant === "icon" ? "" : sizes[size];

    return (
        <button
            className={`inline-flex items-center justify-center rounded-md font-medium transition-colors ${variants[variant]} ${sizeClass} ${className}`}
            {...props}
        />
    );
};