import { ChevronLeft, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';

interface ChangePasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface ApiErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
}
const ChangePasswordPage = () => {
    const router = useRouter();

    const [showCurrent, setShowCurrent] = useState<boolean>(false);
    const [showNew, setShowNew] = useState<boolean>(false);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState<ChangePasswordForm>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!');
            return;
        }
        if (formData.newPassword.length < 6) {
            toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
            return;
        }

        try {
            setLoading(true);
            // Sau này bạn gọi API: await userAPI.changePassword(formData);

            toast.success('Đổi mật khẩu thành công!');
            router.back();
        } catch (error) {
            // 2. Ép kiểu error về interface đã định nghĩa
            const apiError = error as ApiErrorResponse;

            // 3. Sử dụng biến apiError để lấy thông báo, xóa tan lỗi "defined but never used"
            const errorMessage = apiError.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';

            console.error("Lỗi hệ thống:", errorMessage); // Log ra để debug
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 leading-tight">
            <Head>
                <title>Đổi mật khẩu - Vanilla Beauty</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
            </Head>

            <div className="w-full relative pb-28 flex flex-col transition-all duration-300">

                {/* --- HEADER --- */}
                <div className="relative bg-[#00AEEF] pt-8 pb-20 rounded-b-[3rem] shadow-lg overflow-hidden shrink-0">
                    <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

                    <div className="max-w-md mx-auto px-6 relative z-20">
                        <div className="flex items-center justify-between mb-2">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white active:scale-90 transition-all outline-none"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <h1 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Bảo mật</h1>
                            <div className="w-9"></div>
                        </div>
                    </div>
                </div>

                {/* --- ICON DECORATION & TITLE --- */}
                <div className="flex flex-col items-center -mt-10 mb-8 relative z-30 text-center px-6 max-w-md mx-auto w-full">
                    <div className="bg-white p-5 rounded-full shadow-xl border border-slate-50 mb-4">
                        <ShieldCheck size={36} className="text-[#00AEEF]" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Đổi mật khẩu</h2>
                    <p className="text-slate-400 text-xs mt-2 px-4 font-medium leading-relaxed max-w-[280px]">
                        Nhập mật khẩu hiện tại và mật khẩu mới để bảo vệ tài khoản.
                    </p>
                </div>

                {/* --- FORM --- */}
                <form onSubmit={handleSubmit} className="px-6 space-y-5 max-w-md mx-auto w-full flex-1">

                    {/* Mật khẩu hiện tại */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mật khẩu hiện tại</label>
                        <div className="flex items-center bg-white rounded-2xl px-4 py-3.5 border border-slate-100 focus-within:border-[#00AEEF] transition-all shadow-sm relative">
                            <Lock size={18} className="text-slate-400" />
                            <input
                                name="currentPassword"
                                type={showCurrent ? "text" : "password"}
                                required
                                value={formData.currentPassword}
                                onChange={handleInputChange}
                                placeholder="Nhập mật khẩu hiện tại"
                                className="bg-transparent border-none outline-none flex-1 ml-3 text-sm text-slate-700 font-semibold placeholder:text-slate-300"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="text-slate-300 hover:text-[#00AEEF] transition pl-2"
                            >
                                {showCurrent ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Mật khẩu mới */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mật khẩu mới</label>
                        <div className="flex items-center bg-white rounded-2xl px-4 py-3.5 border border-slate-100 focus-within:border-[#00AEEF] transition-all shadow-sm relative">
                            <Lock size={18} className="text-slate-400" />
                            <input
                                name="newPassword"
                                type={showNew ? "text" : "password"}
                                required
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                placeholder="Nhập mật khẩu mới"
                                className="bg-transparent border-none outline-none flex-1 ml-3 text-sm text-slate-700 font-semibold placeholder:text-slate-300"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="text-slate-300 hover:text-[#00AEEF] transition pl-2"
                            >
                                {showNew ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Xác nhận mật khẩu mới */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Xác nhận mật khẩu mới</label>
                        <div className="flex items-center bg-white rounded-2xl px-4 py-3.5 border border-slate-100 focus-within:border-[#00AEEF] transition-all shadow-sm relative">
                            <Lock size={18} className="text-slate-400" />
                            <input
                                name="confirmPassword"
                                type={showConfirm ? "text" : "password"}
                                required
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Xác nhận mật khẩu mới"
                                className="bg-transparent border-none outline-none flex-1 ml-3 text-sm text-slate-700 font-semibold placeholder:text-slate-300"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="text-slate-300 hover:text-[#00AEEF] transition pl-2"
                            >
                                {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Nút Submit */}
                    <div className="pt-8 flex justify-center">
                        <button
                            disabled={loading}
                            type="submit"
                            className={`w-full max-w-xs bg-[#00AEEF] text-white font-bold py-4 rounded-full transition-all active:scale-[0.98] text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-200 flex justify-center items-center ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'
                                }`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                'Cập nhật mật khẩu'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordPage;