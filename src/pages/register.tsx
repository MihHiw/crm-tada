import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneExists, setPhoneExists] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(false);

  // Chuyển url vào bên trong useEffect hoặc sử dụng useMemo nếu muốn dùng làm dependency
  const url = process.env.NEXT_PUBLIC_API_URL || `https://business-crm.tadagram.com`;

  useEffect(() => {
    if (router.isReady) {
      console.log('📝 [Register Page] Checking auth | isAuthenticated:', isAuthenticated);
      if (isAuthenticated) {
        console.log('📝 [Register Page] Already authenticated → Redirecting to /app');
        router.replace('/app');
      } else {
        const savedRef = localStorage.getItem('pendingReferralCode');
        if (savedRef) {
          setReferralCode(savedRef);
        }
      }
    }
    // Fix 39:6 - Thêm router vào dependency array
  }, [router, isAuthenticated]);

  useEffect(() => {
    const checkPhone = async () => {
      if (formData.phone.length === 10) {
        setCheckingPhone(true);
        try {
          const response = await axios.post(`${url}/api/auth/check-user`, {
            phone: formData.phone,
          }, {
            headers: {
              'x-business-code': 'VANILA001'
            }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${url}/api/auth/register`, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        referralCode: referralCode || undefined,
      }, {
        headers: {
          'x-business-code': 'VANILA001'
        }
      });

      login(response.data.token, response.data.user);
      localStorage.removeItem('pendingReferralCode');
      router.replace('/app');
    } catch (err: unknown) {
      // Fix 95:19 - Thay any bằng unknown và ép kiểu an toàn
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
        <title>Đăng ký - Vanilla Beauty & Wellness</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-full p-4 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent mb-2">
              Chào mừng đến Vanilla Beauty 🌸
            </h1>
            <p className="text-gray-600">
              Đăng ký để trải nghiệm dịch vụ làm đẹp cao cấp
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="Nguyễn Văn A"
                />
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="0901234567"
                  pattern="[0-9]{10}"
                  maxLength={10}
                />
              </div>
              {checkingPhone && (
                <p className="text-xs text-blue-500 mt-1 ml-1 flex items-center gap-1">
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang kiểm tra...
                </p>
              )}
              {!checkingPhone && formData.phone.length === 10 && !phoneExists && (
                <p className="text-xs text-green-600 mt-1 ml-1">
                  ✅ Số điện thoại chưa được đăng ký
                </p>
              )}
            </div>

            {/* Referral Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã giới thiệu (nếu có)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={referralCode || ''}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  placeholder="Nhập mã giới thiệu"
                />
              </div>
            </div>

            {/* Phone Exists Warning */}
            {phoneExists && (
              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-orange-800 mb-1">
                      Số điện thoại đã được đăng ký
                    </p>
                    <p className="text-xs text-orange-700 mb-2">
                      Có vẻ như bạn đã có tài khoản. Vui lòng đăng nhập để tiếp tục.
                    </p>
                    <button
                      type="button"
                      onClick={() => router.push('/login')}
                      className="text-xs bg-orange-600 text-white px-3 py-1.5 rounded-md hover:bg-orange-700 transition-colors"
                    >
                      → Đi tới trang đăng nhập
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Referral Code Display (from localStorage) */}
            {referralCode && !formData.phone && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-800 mb-1">
                      🎁 Mã giới thiệu: <span className="font-bold text-lg">{referralCode}</span>
                    </p>
                    <p className="text-xs text-green-700">
                      Bạn sẽ nhận được ưu đãi đặc biệt từ người giới thiệu!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 flex items-start gap-2">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700 flex-1">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || phoneExists}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang đăng ký...
                </span>
              ) : (
                '🚀 Đăng ký ngay'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-pink-600 hover:text-pink-700 font-semibold hover:underline"
              >
                Đăng nhập ngay
              </button>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500 leading-relaxed">
              Bằng việc đăng ký, bạn đồng ý với{' '}
              <a href="#" className="text-pink-600 hover:underline">Điều khoản sử dụng</a>
              {' '}và{' '}
              <a href="#" className="text-pink-600 hover:underline">Chính sách bảo mật</a>
            </p>
          </div>

          {/* Features */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl mb-1">💆‍♀️</div>
              <p className="text-xs text-gray-600">Dịch vụ cao cấp</p>
            </div>
            <div>
              <div className="text-2xl mb-1">🎁</div>
              <p className="text-xs text-gray-600">Ưu đãi hấp dẫn</p>
            </div>
            <div>
              <div className="text-2xl mb-1">⭐</div>
              <p className="text-xs text-gray-600">Đội ngũ chuyên nghiệp</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
