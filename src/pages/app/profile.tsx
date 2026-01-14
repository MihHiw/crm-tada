import BottomNav from '@/components/BottomNav';
import { userAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const { data: profileData } = useQuery('profile', () => userAPI.getProfile(), {
    retry: false,
    onError: (err) => console.log("Lưu ý: Chưa kết nối được Server API", err)
  });

  const profile = profileData?.data?.data?.user || user;

  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      logout();
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 leading-tight pb-24">
      <Head>
        <title>Tài khoản - Vanilla Beauty</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* --- HEADER --- */}
      <div className="relative bg-[#00AEEF] pt-8 pb-20 rounded-b-[3rem] shadow-lg overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 px-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white active:scale-95 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white active:scale-95 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white mb-3">
              {profile?.avatar ? (
                <Image src={profile.avatar} alt="Avatar" width={96} height={96} className="object-cover w-full h-full" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-[#00AEEF]">
                  {profile?.name?.charAt(0) || 'B'}
                </div>
              )}
            </div>
            <h1 className="text-xl font-bold text-white mb-1">{profile?.name || 'Nguyễn Thúy Hằng'}</h1>
            <p className="text-white/90 text-xs font-medium bg-black/10 px-4 py-1 rounded-full backdrop-blur-sm">
              {profile?.phone || '0123456789'}
            </p>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="px-5 -mt-10 space-y-6 relative z-20 max-w-md mx-auto">

        {/* 1. Membership Card */}
        <div className="bg-[#1E293B] rounded-[2rem] p-6 shadow-2xl text-white relative overflow-hidden ring-1 ring-white/10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">MEMBERSHIP CARD</p>
              <p className="text-sm font-bold text-[#4ADE80] flex items-center gap-2">
                <span className="w-2 h-2 bg-[#4ADE80] rounded-full shadow-[0_0_8px_#4ADE80]"></span>
                {profile?.membership?.rank?.name || 'Hạng Bạc'}
              </p>
            </div>
            <div className="italic font-black text-xl opacity-20 tracking-tighter ">VANILLA</div>
          </div>

          <div className="space-y-6">
            <p className="text-2xl font-mono tracking-[0.25em] text-white/95 font-semibold text-center">
              {profile?.membership?.card_number || 'VNL-2024-888'}
            </p>

            <div className="flex justify-between items-end border-t border-white/10 pt-4">
              <div>
                <p className="text-[9px] uppercase text-slate-400 font-bold mb-1">TÍCH LŨY</p>
                <p className="text-lg font-bold text-yellow-500">
                  {(profile?.membership?.points || 1200).toLocaleString()} <span className="text-[10px] text-white/50 lowercase font-normal">xu</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] uppercase text-slate-400 font-bold mb-1">HẠN DÙNG</p>
                <p className="text-xs font-semibold text-slate-300">12/26</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Wallet Section */}
        <div className="bg-white rounded-[2rem] shadow-sm p-6 border border-slate-100">
          <div className="text-center mb-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">SỐ DƯ VÍ CỦA BẠN</p>
            <div className="flex items-baseline justify-center">
              <span className="text-3xl font-black text-slate-800 tracking-tight">
                {(profile?.balance ?? 500000).toLocaleString()}
              </span>
              <span className="text-lg font-bold text-[#00AEEF] ml-1">đ</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              {
                label: 'Nạp tiền',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />,
                color: 'bg-emerald-50 text-emerald-600',
                path: '/app/deposit'
              },
              {
                label: 'Rút tiền',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />,
                color: 'bg-rose-50 text-rose-600',
                path: '/app/withdraw'
              },
              {
                label: 'Giao dịch',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
                color: 'bg-blue-50 text-blue-600',
                path: '/app/history'
              },
              {
                label: 'Lịch đặt',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
                color: 'bg-violet-50 text-violet-600',
                path: '/app/booking'
              },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => item.path && router.push(item.path)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shadow-sm group-active:scale-90 transition-all`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Menu List - ĐÃ SỬA FULL ICON */}
        <div className="bg-white rounded-[1.8rem] shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
          {[
            {
              label: 'Kho Voucher của tôi',
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />,
              color: 'text-rose-400',
              path: '/app/promotions'
            },
            {
              label: 'Lịch sử giao dịch',
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
              color: 'text-blue-400',
              path: '/app/history'
            },
            {
              label: 'Thiết lập thông báo',
              // SỬA: Icon Chuông (Notification Bell) đầy đủ
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
              color: 'text-green-400',
              path: '/app/notifications'
            },
            {
              label: 'Thiết lập tài khoản',
              // SỬA: Icon Bánh răng (Settings Gear) đầy đủ
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
              color: 'text-slate-400',
              path: '/app/settings'
            },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => item.path && router.push(item.path)}
              className="flex items-center justify-between py-4 px-6 active:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-slate-50 ${item.color} flex items-center justify-center`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </div>
                <span className="text-sm font-bold text-slate-700">{item.label}</span>
              </div>
              <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          ))}
        </div>
      </main>

      {/* --- BOTTOM NAV --- */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 z-50">
        <BottomNav />
      </nav>
    </div>
  );
}