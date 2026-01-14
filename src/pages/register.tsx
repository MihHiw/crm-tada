import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Gift,
  Loader2,
  Lock,
  Smartphone,
  Sparkles,
  User,
} from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();

  // UPDATE: Thêm password vào state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
  });

  // UPDATE: State quản lý ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneExists, setPhoneExists] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(false);

  const url = process.env.NEXT_PUBLIC_API_URL || `https://business-crm.tadagram.com`;

  // --- AUTH CHECK ---
  useEffect(() => {
    if (router.isReady) {
      if (isAuthenticated) {
        router.replace('/app');
      } else {
        const savedRef = localStorage.getItem('pendingReferralCode');
        if (savedRef) {
          setReferralCode(savedRef);
        }
      }
    }
  }, [router, isAuthenticated]);

  // --- CHECK PHONE LOGIC ---
  useEffect(() => {
    const checkPhone = async () => {
      if (formData.phone.length >= 10) {
        setCheckingPhone(true);
        try {
          const response = await axios.post(`${url}/api/auth/check-user`, {
            phone: formData.phone,
          }, {
            headers: { 'x-business-code': 'VANILA001' }
          });
          setPhoneExists(response.data.exists);
        } catch (err) {
          console.error('Error checking phone:', err);
        } finally {
          setCheckingPhone(false);
        }
      } else {
        setPhoneExists(false);
      }
    };

    const timer = setTimeout(checkPhone, 500);
    return () => clearTimeout(timer);
  }, [formData.phone, url]);

  // --- SUBMIT LOGIC ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${url}/api/auth/register`, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        password: formData.password, // UPDATE: Gửi password lên API
        referralCode: referralCode || undefined,
      }, {
        headers: { 'x-business-code': 'VANILA001' }
      });

      login(response.data.token, response.data.user);
      localStorage.removeItem('pendingReferralCode');
      router.replace('/app');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      } else {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Đăng ký - Business Portal</title>
      </Head>

      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050B14] relative overflow-hidden font-sans selection:bg-blue-500/30">

        {/* --- Background Effects --- */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[128px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />

        {/* --- CONTENT --- */}
        <div className="w-full max-w-[440px] px-4 relative z-10 flex flex-col items-center">

          {/* Header Section */}
          <div className="mb-8 flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-700">
            {/* Logo */}
            <div className="relative group mb-6">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-white/10 overflow-hidden">
                <Image
                  src="/img/logo.png"
                  alt="Logo"
                  width={0}
                  height={0}
                  sizes="100vw"
                  priority
                  className="w-12 h-auto object-contain"
                />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-bold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Tạo tài khoản mới 🚀
              </h2>
              <p className="text-slate-400 text-sm mt-2">Trải nghiệm dịch vụ quản lý chuyên nghiệp</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="w-full p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] shadow-2xl animate-in fade-in zoom-in-95 duration-500 delay-150">

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Họ và tên</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block w-full pl-11 pr-4 py-3.5
                               bg-slate-900/50 
                               border border-slate-700/50 
                               hover:border-slate-600
                               rounded-2xl
                               text-white 
                               placeholder:text-slate-600
                               focus:outline-none focus:bg-slate-900
                               focus:border-blue-500 
                               focus:ring-2 focus:ring-blue-500/20
                               transition-all duration-300 sm:text-sm font-medium tracking-wide"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Số điện thoại</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Smartphone className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="block w-full pl-11 pr-4 py-3.5
                               bg-slate-900/50 
                               border border-slate-700/50 
                               hover:border-slate-600
                               rounded-2xl
                               text-white 
                               placeholder:text-slate-600
                               focus:outline-none focus:bg-slate-900
                               focus:border-blue-500 
                               focus:ring-2 focus:ring-blue-500/20
                               transition-all duration-300 sm:text-sm font-medium tracking-wide"
                    placeholder="0901234567"
                    maxLength={10}
                  />
                  {checkingPhone && (
                    <div className="absolute inset-y-0 right-4 flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    </div>
                  )}
                </div>
                {/* Phone Exists Warning */}
                {!checkingPhone && phoneExists && (
                  <div className="text-xs text-orange-400 font-medium ml-1 animate-in fade-in slide-in-from-top-1">
                    ⚠️ Số điện thoại đã tồn tại. <span className="cursor-pointer underline hover:text-orange-300" onClick={() => router.push('/login')}>Đăng nhập ngay?</span>
                  </div>
                )}
              </div>

              {/* UPDATE: Password Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Mật khẩu</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="block w-full pl-11 pr-11 py-3.5
                               bg-slate-900/50 
                               border border-slate-700/50 
                               hover:border-slate-600
                               rounded-2xl
                               text-white 
                               placeholder:text-slate-600
                               focus:outline-none focus:bg-slate-900
                               focus:border-blue-500 
                               focus:ring-2 focus:ring-blue-500/20
                               transition-all duration-300 sm:text-sm font-medium tracking-wide"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Referral Code Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Mã giới thiệu (Nếu có)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Gift className="h-5 w-5 text-slate-500 group-focus-within:text-pink-400 transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    value={referralCode || ''}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    className="block w-full pl-11 pr-4 py-3.5
                               bg-slate-900/50 
                               border border-slate-700/50 
                               hover:border-slate-600
                               rounded-2xl
                               text-white 
                               placeholder:text-slate-600
                               focus:outline-none focus:bg-slate-900
                               focus:border-pink-500 
                               focus:ring-2 focus:ring-pink-500/20
                               transition-all duration-300 sm:text-sm font-medium tracking-wide uppercase"
                    placeholder="VD: REF123"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="p-1 bg-red-500/20 rounded-full">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                  <span className="text-sm text-red-200">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || phoneExists}
                className="w-full py-4 px-4 relative group overflow-hidden rounded-2xl font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_100%] animate-gradient"></div>
                <div className="relative flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                    <>
                      <span>Đăng ký ngay</span>
                      <Sparkles className="w-4 h-4 text-blue-200 group-hover:text-white transition-colors" />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#121826] px-3 text-slate-500 font-medium rounded-full border border-white/5">Hoặc</span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-slate-500 text-sm">
                Đã có tài khoản?{' '}
                <button onClick={() => router.push('/login')} className="text-blue-400 font-semibold hover:text-blue-300 transition-colors relative group">
                  Đăng nhập
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
                </button>
              </p>
            </div>

          </div>

          {/* Terms */}
          <div className="mt-8 text-center px-8">
            <p className="text-[10px] text-slate-600 leading-relaxed">
              Bằng việc đăng ký, bạn đồng ý với <a href="#" className="underline hover:text-slate-400">Điều khoản sử dụng</a> và <a href="#" className="underline hover:text-slate-400">Chính sách bảo mật</a> của chúng tôi.
            </p>
          </div>

        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
        }
        .animate-gradient {
            animation: gradient 3s ease infinite;
        }
      `}</style>
    </>
  );
}