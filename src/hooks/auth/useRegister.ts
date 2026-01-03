"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function useRegister() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Kiểm tra Họ và tên (Tối thiểu 2 từ)
        if (formData.fullName.trim().split(" ").length < 2) {
            alert("Vui lòng nhập đầy đủ họ và tên!");
            return;
        }

        // 2. Kiểm tra Số điện thoại (Đúng 10 chữ số VN)
        const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/;
        if (!phoneRegex.test(formData.phone)) {
            alert("Số điện thoại không hợp lệ (Phải có 10 chữ và bắt đầu bằng số 0)!");
            return;
        }

        // 3. Kiểm tra định dạng Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert("Định dạng email không hợp lệ!");
            return;
        }

        // 4. Kiểm tra độ mạnh mật khẩu (Tối thiểu 6 ký tự)
        if (formData.password.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        // 5. Kiểm tra khớp mật khẩu
        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        // 6. Kiểm tra đồng ý điều khoản
        if (!formData.agreeTerms) {
            alert("Bạn phải đồng ý với điều khoản của Tada Group!");
            return;
        }

        setIsLoading(true);
        // Giả lập gọi API
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsLoading(false);
        alert("Đăng ký thành công!");
        router.push('/login');
    };

    return { formData, setFormData, isLoading, showPassword, setShowPassword, handleRegister };
}