"use client";
import { useRegister } from '@/hooks/auth/useRegister';
import { ArrowRight, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function RegisterPage() {
    const { formData, setFormData, isLoading, showPassword, setShowPassword, handleRegister } = useRegister();

    /**
     * Hàm xử lý nhập số điện thoại chuyên sâu:
     * 1. Chỉ cho phép nhập số
     * 2. Bắt buộc bắt đầu bằng số 0
     * 3. Giới hạn tối đa 10 ký tự
     */
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, ''); // Loại bỏ ký tự không phải số

        // Tự động thêm số 0 nếu người dùng nhập số khác đầu tiên
        if (val.length > 0 && val[0] !== '0') {
            val = '0' + val;
        }

        setFormData({ ...formData, phone: val.slice(0, 10) });
    };

    return (
        <div className="min-h-screen bg-[#0B0F1A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor - Đồng bộ với trang Login */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>

            {/* Logo TadaUp */}
            <div className="mb-8 relative z-10">
                <Image src="/img/logo.png" alt="Tada Logo" width={120} height={40} className="object-contain" />
            </div>

            {/* Register Card */}
            <div className="w-full max-w-[480px] bg-[#161D2F]/80 backdrop-blur-xl border border-gray-800 p-10 rounded-[40px] shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Tạo tài khoản mới</h1>
                    <p className="text-gray-500 text-sm mt-2">Bắt đầu hành trình quản trị tài chính cùng Tada</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5 text-left">
                    {/* Họ và tên - Hàng riêng biệt */}
                    <div className="space-y-2 text-left">
                        <label className="text-[11px] text-gray-500 font-bold uppercase tracking-widest ml-1 block">Họ và tên</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="text"
                                required
                                placeholder="Trần Văn Tú"
                                value={formData.fullName}
                                className="w-full bg-[#0B0F1A] border border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-blue-600 outline-none transition-all placeholder:text-gray-700"
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Số điện thoại - Hàng riêng biệt bên dưới */}
                    <div className="space-y-2 text-left">
                        <label className="text-[11px] text-gray-500 font-bold uppercase ml-1 block">Số điện thoại</label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="tel"
                                required
                                placeholder="09xx xxx xxx"
                                value={formData.phone}
                                className="w-full bg-[#0B0F1A] border border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white outline-none focus:border-blue-600 transition-all placeholder:text-gray-700"
                                onChange={handlePhoneChange}
                            />
                        </div>
                    </div>

                    {/* Email doanh nghiệp */}
                    <div className="space-y-2 text-left">
                        <label className="text-[11px] text-gray-500 font-bold uppercase tracking-widest ml-1 block">Email doanh nghiệp</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="email"
                                required
                                placeholder="name@company.com"
                                value={formData.email}
                                className="w-full bg-[#0B0F1A] border border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-blue-600 outline-none transition-all placeholder:text-gray-700"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Mật khẩu */}
                    <div className="space-y-2 text-left">
                        <label className="text-[11px] text-gray-500 font-bold uppercase tracking-widest ml-1 block">Mật khẩu</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Tối thiểu 6 ký tự"
                                value={formData.password}
                                className="w-full bg-[#0B0F1A] border border-gray-800 rounded-2xl py-3.5 pl-12 pr-12 text-sm text-white focus:border-blue-600 outline-none transition-all placeholder:text-gray-700"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div className="space-y-2 text-left">
                        <label className="text-[11px] text-gray-500 font-bold uppercase tracking-widest ml-1 block">Xác nhận mật khẩu</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Nhập lại mật khẩu"
                                value={formData.confirmPassword}
                                className="w-full bg-[#0B0F1A] border border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-blue-600 outline-none transition-all placeholder:text-gray-700"
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Điều khoản */}
                    <div className="flex items-start gap-3 pt-2">
                        <input
                            type="checkbox"
                            id="terms"
                            required
                            checked={formData.agreeTerms}
                            className="mt-1 w-4 h-4 rounded border-gray-800 bg-gray-900 text-blue-600 focus:ring-0 cursor-pointer"
                            onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                        />
                        <label htmlFor="terms" className="text-xs text-gray-500 cursor-pointer leading-relaxed text-left">
                            Tôi đồng ý với <span className="text-blue-500 hover:underline">Điều khoản dịch vụ</span> và <span className="text-blue-500 hover:underline">Chính sách bảo mật</span> của Tada.
                        </label>
                    </div>

                    {/* Nút Đăng ký */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ĐANG XỬ LÝ...
                            </span>
                        ) : (
                            <>ĐĂNG KÝ NGAY <ArrowRight size={18} /></>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm font-medium">
                        Đã có tài khoản?{' '}
                        <Link href="/login" className="text-blue-400 font-bold hover:underline transition-colors">
                            Đăng nhập ngay
                        </Link>
                    </p>
                </div>
            </div>

            <footer className="mt-8 relative z-10 text-center">
                <p className="text-gray-600 text-[10px] uppercase font-bold tracking-[0.2em]">© 2026 Tada Group. Make World Wow.</p>
            </footer>
        </div>
    );
}