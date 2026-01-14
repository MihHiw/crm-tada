import { mockUsers } from '@/mocks/users'; // Đảm bảo đường dẫn import đúng file mock của bạn
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Github,
  Loader2,
  Lock,
  Sparkles,
  User,
} from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

// Hàm delay giả lập mạng để trải nghiệm mượt hơn
const fakeDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuthStore();

  // STATE QUẢN LÝ FORM
  const [identifier, setIdentifier] = useState(''); // Email hoặc Số điện thoại
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // CẤU HÌNH
  const IS_MOCK_MODE = true; // Bật chế độ Mock
  const url = process.env.NEXT_PUBLIC_API_URL || `https://business-crm.tadagram.com`;

  // --- LOGIC ĐIỀU HƯỚNG THEO ROLE ---
  const handleRedirect = useCallback((roleId: number) => {
    // 1: Admin, 2: Manager -> Vào trang Admin
    if (roleId === 1 || roleId === 2) {
      router.replace('/admin');
    } else {
      // 3: Staff, 4: Customer -> Vào trang App
      router.replace('/app');
    }
  }, [router]);

  // Check auth khi vào trang (nếu đã login thì redirect luôn)
  useEffect(() => {
    if (router.isReady && isAuthenticated && user) {
      let roleId = 4;
      if (typeof user === 'object' && user !== null && 'role_id' in user) {
        roleId = (user as { role_id: number }).role_id;
      } else if (typeof user === 'object' && user !== null && 'role' in user) {
        const r = (user as { role: string }).role;
        if (r === 'admin') roleId = 1;
        else if (r === 'manager') roleId = 2;
        else if (r === 'sale' || r === 'staff') roleId = 3;
      }
      handleRedirect(roleId);
    }
  }, [router.isReady, isAuthenticated, user, handleRedirect]);

  // --- LOGIC XỬ LÝ ĐĂNG NHẬP ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (IS_MOCK_MODE) {
        // --- CHẾ ĐỘ MOCK DATA ---
        console.log("🔍 [Mock] Đang xác thực user...");
        await fakeDelay(1000); // Giả lập độ trễ mạng

        const input = identifier.trim();

        // Tìm user khớp (Email hoặc Phone) VÀ khớp Mật khẩu
        const foundUser = mockUsers.find(u =>
          (u.email === input || u.phone === input) &&

          u.password === password
        );

        if (foundUser) {
          console.log("✅ [Mock] Đăng nhập thành công:", foundUser.full_name);

          // Map role_id sang string role cho AuthStore (nếu cần)
          const roleMap: Record<number, string> = {
            1: 'admin', 2: 'manager', 3: 'staff', 4: 'customer'
          };

          const mockToken = `mock-jwt-token-${foundUser.id}-${Date.now()}`;
          const adapterUser = {
            id: foundUser.id,
            name: foundUser.full_name,
            email: foundUser.email,
            phone: foundUser.phone,
            role: roleMap[foundUser.role_id] || 'customer',
            role_id: foundUser.role_id,
            avatar: foundUser.avatar_url,
            // Thêm các trường khác nếu store yêu cầu
          };

          // Lưu vào store
          // @ts-expect-error: Suppress type mismatch
          login(mockToken, adapterUser);
          localStorage.setItem("currentUser", JSON.stringify(adapterUser));
          localStorage.setItem("token", mockToken);

          // Chuyển hướng
          handleRedirect(foundUser.role_id);
        } else {
          setError('Tài khoản hoặc mật khẩu không chính xác.');
        }

      } else {
        // --- CHẾ ĐỘ API THẬT ---
        const response = await axios.post(`${url}/api/auth/login`, {
          username: identifier.trim(),
          password: password,
        }, { headers: { 'x-business-code': 'VANILA001' } });

        const userData = response.data.user;
        const token = response.data.token;


        login(token, userData);
        localStorage.setItem("currentUser", JSON.stringify(userData));
        localStorage.setItem("token", token);

        let roleId = userData.role_id || 4;
        handleRedirect(roleId);
      }

    } catch (err: any) {
      console.error('Login Error:', err);
      const msg = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Đăng nhập - Business Portal</title>
      </Head>

      {/* Main Container */}
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050B14] relative overflow-hidden font-sans selection:bg-blue-500/30">

        {/* --- Background Effects --- */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[128px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />

        {/* --- CONTENT --- */}
        <div className="w-full max-w-[420px] px-4 relative z-10 flex flex-col items-center">

          {/* Logo Section */}
          <div className="mb-8 flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>

              {/* Logo Container */}
              <div className="relative w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-white/10 overflow-hidden">
                <Image
                  src="/img/logo.png"
                  alt="Logo"
                  width={0}
                  height={0}
                  sizes="100vw"
                  priority
                  className="w-16 h-auto object-contain"
                />
              </div>

              {/* Badge Version */}
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#050B14]">
                v2.0
              </div>
            </div>

            <div className="mt-6 text-center">
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Xin chào! <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
              </h2>
              <p className="text-slate-400 text-sm mt-2">Đăng nhập để quản lý hệ thống</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="w-full p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] shadow-2xl animate-in fade-in zoom-in-95 duration-500 delay-150">

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Input: Tài khoản */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Tài khoản</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="block w-full pl-11 pr-4 py-4
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
                    placeholder="Email hoặc Số điện thoại"
                  />
                </div>
              </div>

              {/* Input: Mật khẩu */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Mật khẩu</label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors duration-300" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-11 py-4
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
                  {/* Nút Ẩn/Hiện Mật khẩu */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Quên mật khẩu */}
              <div className="flex justify-end">
                <a href="#" className="text-xs font-medium text-slate-400 hover:text-blue-400 transition-colors">
                  Quên mật khẩu?
                </a>
              </div>

              {/* Thông báo lỗi */}
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="p-1 bg-red-500/20 rounded-full">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                  <span className="text-sm text-red-200">{error}</span>
                </div>
              )}

              {/* Nút Đăng nhập */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-4 relative group overflow-hidden rounded-2xl font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_100%] animate-gradient"></div>
                <div className="relative flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                    <>
                      <span>Đăng nhập</span>
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
                <span className="bg-[#121826] px-3 text-slate-500 font-medium rounded-full border border-white/5">Hoặc tiếp tục với</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12.61C5,8.85 8.38,5.78 12.23,5.78C14.61,5.78 16.28,6.81 17.15,7.62L19.12,5.66C17.31,3.97 14.87,2.88 12.21,2.88C6.61,2.88 2.06,7.29 2.06,12.61C2.06,17.92 6.61,22.33 12.21,22.33C17.81,22.33 22.36,17.92 22.36,12.61C22.36,11.96 22.25,11.43 21.35,11.1Z" fill="#FFF" />
                  <path fill="#EA4335" d="M12.21 2.88c2.66 0 5.1 1.09 6.91 2.78l-1.97 1.96c-.87-.81-2.54-1.84-4.92-1.84-3.85 0-7.23 3.07-7.23 6.83 0 .36.03.71.08 1.06L2.3 11.2C1.29 8.64 2.87 2.88 12.21 2.88z" />
                  <path fill="#FBBC05" d="M5.08 13.67c-.05-.35-.08-.7-.08-1.06 0-3.76 3.38-6.83 7.23-6.83 2.38 0 4.05 1.03 4.92 1.84l1.97-1.96C17.31 3.97 14.87 2.88 12.21 2.88 2.87 2.88 1.29 8.64 2.3 11.2l2.78 2.47z" className="opacity-0" />
                </svg>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white">Google</span>
              </button>

              <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
                <Github className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-slate-300 group-hover:text-white">GitHub</span>
              </button>
            </div>

          </div>
          <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <p className="text-slate-500 text-sm">
              Chưa có tài khoản?{' '}
              <button onClick={() => router.push('/register')} className="text-blue-400 font-semibold hover:text-blue-300 transition-colors relative group">
                Đăng ký ngay
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full"></span>
              </button>
            </p>
          </div>

        </div>

      </div>

      {/* Global Styles cho Animation */}
      <style jsx global>{`
        @keyframes wave {
            0% { transform: rotate(0.0deg) }
            10% { transform: rotate(14.0deg) }
            20% { transform: rotate(-8.0deg) }
            30% { transform: rotate(14.0deg) }
            40% { transform: rotate(-4.0deg) }
            50% { transform: rotate(10.0deg) }
            60% { transform: rotate(0.0deg) }
            100% { transform: rotate(0.0deg) }
        }
        .animate-wave {
            animation: wave 2.5s infinite;
        }
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