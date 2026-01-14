import { mockUsers } from '@/mocks/users';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import { AlertTriangle, Info, Phone, Smartphone } from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

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
    // Đảm bảo roleId hợp lệ
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
        console.log("Đang chạy chế độ Mock Data..."); // Log để debug
        await fakeDelay(1000);

        // Tìm user trong danh sách mock (đảm bảo file @/mocks/auth có user này)
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
          // Thêm gợi ý số điện thoại nếu nhập sai
          setError('SĐT không có trong dữ liệu Mock (Thử: 0901234567)');
        }
      } else {
        // --- LOGIC API THẬT ---
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
        <title>Đăng nhập - Vanilla Beauty & Wellness</title>
      </Head>

      <div className="min-h-screen bg-[#FFF5F5] flex items-center justify-center p-4 font-sans selection:bg-orange-100 selection:text-orange-600">
        <div className="bg-white rounded-[30px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] p-8 md:p-8 w-full max-w-[450px] relative">

          <div className="flex flex-col items-center mb-6">
            <div className="inline-block bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-full p-4 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent mb-2">
              Chào mừng trở lại! 👋
            </h1>

            <p className="text-gray-500 text-sm font-medium">
              Đăng nhập để tiếp tục sử dụng dịch vụ
            </p>

            {/* Hiển thị dòng này để biết đang chạy Mock Mode */}
            {IS_MOCK_MODE && (
              <span className="mt-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-[10px] rounded font-mono font-bold border border-yellow-300">
                MOCK MODE ENABLED
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 ml-1">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-[18px] w-[18px] text-gray-400 group-focus-within:text-[#FF512F] transition-colors" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#FF512F] focus:ring-4 focus:ring-[#FF512F]/10 transition-all shadow-sm hover:border-gray-300"
                  placeholder="0901234567"
                  maxLength={15} // Đã bỏ pattern cứng để tránh lỗi nhập liệu
                />
              </div>
              <p className="text-[10px] text-gray-400 ml-1 flex items-center gap-1.5">
                <Smartphone size={12} /> Nhập số điện thoại đã đăng ký
              </p>
            </div>

            <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl p-4 flex gap-3 items-start">
              <Info className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-[#1D4ED8] mb-1">Đăng nhập không cần mật khẩu</p>
                <p className="text-[10px] text-[#3B82F6] leading-relaxed font-medium">
                  Chỉ cần nhập số điện thoại đã đăng ký, hệ thống sẽ tự động nhận diện và đăng nhập cho bạn.
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-[#FEF2F2] border border-[#FEE2E2] text-[#EF4444] px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-shake font-medium">
                <AlertTriangle size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang đăng nhập...
                </span>
              ) : (
                '🔓 Đăng nhập'
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-6">
            <p className="text-xs text-gray-500 font-medium">
              Chưa có tài khoản?{' '}
              <button
                onClick={() => router.push('/register')}
                className="text-[#FF512F] hover:text-[#E04F30] font-bold hover:underline transition-all"
              >
                Đăng ký ngay
              </button>
            </p>

            <div className="mt-4 pt-6 border-t border-gray-200">
              <p className="text-center text-xs text-gray-500 leading-relaxed">
                Gặp vấn đề khi đăng nhập?{' '}
                <a href="#" className="text-pink-600 hover:underline">Liên hệ hỗ trợ</a>
              </p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl mb-1">🔒</div>
                <p className="text-xs text-gray-600">Bảo mật cao</p>
              </div>
              <div>
                <div className="text-2xl mb-1">⚡</div>
                <p className="text-xs text-gray-600">Đăng nhập nhanh</p>
              </div>
              <div>
                <div className="text-2xl mb-1">📱</div>
                <p className="text-xs text-gray-600">Nhiều thiết bị</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}