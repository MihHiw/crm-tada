import { mockUsers } from '@/mocks/users';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import { AlertTriangle, Info, MonitorSmartphone, Phone, ShieldCheck, Smartphone, Zap } from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
// Đảm bảo bạn đã import đúng đường dẫn component GlobalBackground
import GlobalBackground from '@/components/GlobalBackground';

const fakeDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const url = process.env.NEXT_PUBLIC_API_URL || `https://business-crm.tadagram.com`;

  const IS_MOCK_MODE = true;

  const handleRedirect = useCallback((roleId: number) => {
    if (roleId === 1 || roleId === 2) {
      router.replace('/admin');
    } else {
      router.replace('/app');
    }
  }, [router]);

  useEffect(() => {
    if (router.isReady) {
      if (isAuthenticated && user) {
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
    }
  }, [router, isAuthenticated, user, handleRedirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (IS_MOCK_MODE) {
        console.log("Đang chạy chế độ Mock Data...");
        await fakeDelay(1000);

        const foundUser = mockUsers.find(u => u.phone === phone.trim());

        if (foundUser) {
          await fakeDelay(500);
          const mockToken = `mock-token-${foundUser.id}-${Date.now()}`;
          const roleStringMap: Record<number, string> = { 1: 'admin', 2: 'admin', 3: 'sale', 4: 'customer' };

          const safePhone = foundUser.phone || '';
          const refCode = safePhone.length >= 4 ? 'REF' + safePhone.slice(-4) : 'REF0000';

          type StoreUserType = Parameters<typeof login>[1];

          const adapterUser = {
            id: foundUser.id,
            name: foundUser.full_name,
            role: roleStringMap[foundUser.role_id] || 'customer',
            avatar: foundUser.avatar_url || undefined,
            balance: 0,
            referralCode: refCode,
            customerId: foundUser.id,
            role_id: foundUser.role_id,
          };

          login(mockToken, adapterUser as unknown as StoreUserType);
          localStorage.setItem("currentUser", JSON.stringify(adapterUser));
          localStorage.setItem("token", mockToken);

          handleRedirect(foundUser.role_id);
        } else {
          setError('SĐT không có trong dữ liệu Mock (Thử: 0901234567)');
        }
      } else {
        const response = await axios.post(`${url}/api/auth/check-user`, { phone: phone.trim() }, { headers: { 'x-business-code': 'VANILA001' } });
        if (response.data.exists) {
          const loginResponse = await axios.post(`${url}/api/auth/login-by-phone`, { phone: phone.trim() }, { headers: { 'x-business-code': 'VANILA001' } });
          const apiUser = loginResponse.data.user;
          const apiToken = loginResponse.data.token;

          login(apiToken, apiUser);
          localStorage.setItem("currentUser", JSON.stringify(apiUser));
          localStorage.setItem("token", apiToken);

          const roleId = apiUser.role === 'admin' ? 1 : (apiUser.role === 'manager' ? 2 : 3);
          handleRedirect(roleId);
        } else {
          setError('Số điện thoại chưa đăng ký. Vui lòng liên hệ quản trị viên.');
        }
      }
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Đăng nhập thất bại.');
      } else {
        setError('Đã có lỗi xảy ra.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Đăng nhập - BizTada</title>
      </Head>

      {/* Thay đổi 1: Wrapper bọc GlobalBackground */}
      <div className="min-h-screen flex items-center justify-center p-4 font-sans text-white relative">
        <GlobalBackground />

        {/* Thay đổi 2: Card sử dụng Glassmorphism (bg-white/10, backdrop-blur) */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[30px] shadow-2xl p-8 md:p-10 w-full max-w-[450px] relative z-10 animate-in fade-in zoom-in duration-500">

          <div className="flex flex-col items-center mb-8">
            {/* Icon Gradient Xanh/Tím */}
            <div className="inline-block bg-gradient-to-tr from-cyan-500 to-blue-600 text-white rounded-2xl p-4 mb-4 shadow-lg shadow-blue-500/30">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2 text-center tracking-tight">
              Chào mừng trở lại! 👋
            </h1>

            <p className="text-white/60 text-sm font-medium text-center">
              Đăng nhập hệ thống CRM
            </p>

            {IS_MOCK_MODE && (
              <span className="mt-3 px-3 py-1 bg-amber-500/20 text-amber-300 text-[10px] rounded-full font-mono font-bold border border-amber-500/30 backdrop-blur-sm">
                MOCK MODE ENABLED
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-white/80 ml-1 uppercase tracking-wider">
                Số điện thoại
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  {/* Icon màu trắng mờ, focus sáng lên */}
                  <Phone className="h-[18px] w-[18px] text-white/40 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                {/* Input nền tối mờ */}
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/20 transition-all hover:bg-black/30"
                  placeholder="0901234567"
                  maxLength={15}
                />
              </div>
              <p className="text-[10px] text-white/40 ml-1 flex items-center gap-1.5">
                <Smartphone size={12} /> Nhập số điện thoại đã đăng ký
              </p>
            </div>

            {/* Info Box màu xanh dương đậm */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3 items-start backdrop-blur-sm">
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-blue-300 mb-1">Đăng nhập không cần mật khẩu</p>
                <p className="text-[10px] text-blue-200/70 leading-relaxed font-medium">
                  Hệ thống tự động nhận diện tài khoản qua số điện thoại.
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-shake font-medium backdrop-blur-sm">
                <AlertTriangle size={14} className="text-red-400" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              // Button Gradient xanh/tím để nổi bật trên nền tối
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-900/50 hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-white/10"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white/80" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                '🔓 Đăng nhập ngay'
              )}
            </button>
          </form>

          <div className="mt-8 text-center space-y-6">
            <p className="text-xs text-white/40 font-medium">
              Chưa có tài khoản?{' '}
              <button
                onClick={() => router.push('/register')}
                className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition-all"
              >
                Đăng ký thành viên
              </button>
            </p>

            <div className="mt-4 pt-6 border-t border-white/10">
              <p className="text-center text-xs text-white/30 leading-relaxed">
                Gặp vấn đề?{' '}
                <a href="#" className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors">Liên hệ hỗ trợ</a>
              </p>
            </div>

            {/* Grid Features */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-2 group">
                <div className="p-2 bg-white/5 rounded-full text-white/70 group-hover:text-cyan-400 group-hover:bg-white/10 transition-all">
                  <ShieldCheck size={20} />
                </div>
                <p className="text-[10px] text-white/40 group-hover:text-white/60 transition-colors">Bảo mật cao</p>
              </div>
              <div className="flex flex-col items-center gap-2 group">
                <div className="p-2 bg-white/5 rounded-full text-white/70 group-hover:text-cyan-400 group-hover:bg-white/10 transition-all">
                  <Zap size={20} />
                </div>
                <p className="text-[10px] text-white/40 group-hover:text-white/60 transition-colors">Tốc độ nhanh</p>
              </div>
              <div className="flex flex-col items-center gap-2 group">
                <div className="p-2 bg-white/5 rounded-full text-white/70 group-hover:text-cyan-400 group-hover:bg-white/10 transition-all">
                  <MonitorSmartphone size={20} />
                </div>
                <p className="text-[10px] text-white/40 group-hover:text-white/60 transition-colors">Đa nền tảng</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}