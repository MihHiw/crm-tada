import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
// 1. XÓA IMPORT GlobalBackground
// import GlobalBackground from '@/components/GlobalBackground';
import { AlertTriangle, Check, Gift, Phone, ShieldCheck, Star, User, Zap } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneExists, setPhoneExists] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(false);

  const [mounted, setMounted] = useState(false);

  const url = process.env.NEXT_PUBLIC_API_URL || `https://business-crm.tadagram.com`;

  useEffect(() => {
    setMounted(true);
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

  useEffect(() => {
    const checkPhone = async () => {
      if (formData.phone.length === 10) {
        setCheckingPhone(true);
        try {
          const response = await axios.post(`${url}/api/auth/check-user`, {
            phone: formData.phone,
          }, { headers: { 'x-business-code': 'VANILA001' } });
          setPhoneExists(response.data.exists);
        } catch (err) {
          console.error(err);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${url}/api/auth/register`, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        referralCode: referralCode || undefined,
      }, { headers: { 'x-business-code': 'VANILA001' } });

      login(response.data.token, response.data.user);
      localStorage.removeItem('pendingReferralCode');
      router.replace('/app');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Đăng ký thất bại.');
      } else {
        setError('Đã có lỗi xảy ra.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <Head>
        <title>Đăng ký - BizTada</title>
      </Head>

      <div
        suppressHydrationWarning
        className="min-h-screen flex items-center justify-center p-4 font-sans text-white relative overflow-hidden bg-slate-900"
      >
        {/* 2. BACKGROUND TRỰC TIẾP (Thay thế GlobalBackground) */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-indigo-900 to-blue-900"></div>

          {/* Style Animation nội bộ */}
          <style jsx>{`
              @keyframes blob-bounce { 0% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0, 0) scale(1); } }
              .animate-blob-1 { animation: blob-bounce 10s infinite ease-in-out; }
              .animate-blob-2 { animation: blob-bounce 15s infinite ease-in-out reverse; }
            `}</style>

          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[100px] mix-blend-screen animate-blob-1 opacity-50"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/30 rounded-full blur-[100px] mix-blend-screen animate-blob-2 opacity-50"></div>
        </div>

        {/* Nội dung chính (z-10 để nổi lên trên background) */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[30px] shadow-2xl p-8 max-w-md w-full relative z-10 animate-in fade-in zoom-in duration-500">

          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-tr from-cyan-500 to-blue-600 text-white rounded-2xl p-4 mb-4 shadow-lg shadow-blue-500/30">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Tạo tài khoản mới ✨
            </h1>
            <p className="text-white/60 text-sm">
              Trải nghiệm dịch vụ làm đẹp đẳng cấp
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-white/80 ml-1 uppercase tracking-wider">
                Họ và tên <span className="text-rose-400">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-[18px] w-[18px] text-white/40 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full pl-11 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/20 transition-all hover:bg-black/30"
                  placeholder="Nguyễn Văn A"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-white/80 ml-1 uppercase tracking-wider">
                Số điện thoại <span className="text-rose-400">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-[18px] w-[18px] text-white/40 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="block w-full pl-11 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/20 transition-all hover:bg-black/30"
                  placeholder="0901234567"
                  pattern="[0-9]{10}"
                  maxLength={10}
                />
              </div>

              {checkingPhone && (
                <p className="text-[10px] text-cyan-400 mt-1 ml-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span>
                  Đang kiểm tra...
                </p>
              )}
              {!checkingPhone && formData.phone.length === 10 && !phoneExists && (
                <p className="text-[10px] text-emerald-400 mt-1 ml-1 flex items-center gap-1.5 font-bold">
                  <Check size={12} /> Số điện thoại hợp lệ
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-white/80 ml-1 uppercase tracking-wider">
                Mã giới thiệu (Nếu có)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Gift className="h-[18px] w-[18px] text-white/40 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="text"
                  value={referralCode || ''}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="block w-full pl-11 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/20 transition-all hover:bg-black/30 uppercase tracking-widest font-bold"
                  placeholder="Mã CODE"
                />
              </div>
            </div>

            {phoneExists && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-amber-300 mb-1">
                      Số điện thoại đã tồn tại
                    </p>
                    <div className="text-xs text-white/40 font-medium">
                      Đã có tài khoản?{' '}
                      <button
                        onClick={() => router.push('/login')}
                        className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition-all"
                      >
                        Đăng nhập ngay
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-shake font-medium backdrop-blur-sm">
                <AlertTriangle size={14} className="text-red-400" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || phoneExists}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-900/50 hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
            >
              {loading ? 'Đang xử lý...' : '🚀 Đăng ký thành viên'}
            </button>
          </form>

          <div className="mt-8 text-center space-y-6">
            {/* 3. SỬA LỖI: Dùng div thay vì p để bọc button */}
            <div className="text-xs text-white/40 font-medium">
              Đã có tài khoản?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition-all"
              >
                Đăng nhập ngay
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-2 group">
                <div className="p-2 bg-white/5 rounded-full text-white/70 group-hover:text-cyan-400 transition-all"><ShieldCheck size={20} /></div>
                <p className="text-[10px] text-white/40 group-hover:text-white/60">Dịch vụ VIP</p>
              </div>
              <div className="flex flex-col items-center gap-2 group">
                <div className="p-2 bg-white/5 rounded-full text-white/70 group-hover:text-cyan-400 transition-all"><Zap size={20} /></div>
                <p className="text-[10px] text-white/40 group-hover:text-white/60">Ưu đãi Hot</p>
              </div>
              <div className="flex flex-col items-center gap-2 group">
                <div className="p-2 bg-white/5 rounded-full text-white/70 group-hover:text-cyan-400 transition-all"><Star size={20} /></div>
                <p className="text-[10px] text-white/40 group-hover:text-white/60">Chuyên nghiệp</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}