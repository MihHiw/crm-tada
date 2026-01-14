import BottomNav from '@/components/BottomNav';
import { useReferralData } from '@/hooks/referral/useReferral';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function ReferralPage() {
  const router = useRouter();
  const [copyStatus, setCopyStatus] = useState<'code' | 'link' | null>(null);
  const { summary, friends, loading, error } = useReferralData();

  const handleCopy = (text: string, type: 'code' | 'link') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopyStatus(type);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  // --- LOGIC SỬA LỖI HOA HỒNG ---
  // Tính lại hoa hồng thực nhận (chỉ cộng dồn các đơn đã 'completed')
  const earnedCommission = friends.reduce((total, friend) => {
    return friend.status === 'completed' ? total + friend.commission : total;
  }, 0);

  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <>
      <Head>
        <title>Giới thiệu bạn bè - Mock Demo</title>
      </Head>
      <div className="min-h-screen bg-gray-50 pb-20">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
            <button onClick={() => router.back()} className="text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900">Giới thiệu bạn bè</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* ----- PHẦN 1: MÃ GIỚI THIỆU ----- */}
          <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg shadow-lg p-6 mb-6 text-white">
            <h2 className="text-lg font-bold mb-2">Mã giới thiệu của bạn</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-3">
                <p className="text-2xl font-mono font-bold tracking-wider">
                  {loading ? '...' : (summary?.referralCode || 'N/A')}
                </p>
              </div>
              <button
                disabled={loading}
                onClick={() => summary?.referralCode && handleCopy(summary.referralCode, 'code')}
                className="bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition px-4 py-3 rounded-lg"
              >
                {copyStatus === 'code' ? (
                  <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                )}
              </button>
            </div>
            <p className="text-sm opacity-90">Chia sẻ mã này với bạn bè để nhận hoa hồng!</p>
          </div>

          {/* ----- PHẦN 2: THỐNG KÊ ----- */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng bạn bè</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {/* Fix: Dùng summary?.stats */}
                    {summary?.stats.totalFriends || 0}
                  </p>
                </div>
              </div>
            </div>

            <Link href="/app/commission" className="">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hoa hồng</p>
                    {/* Fix: Dùng earnedCommission để hiển thị số tiền thực nhận */}
                    <p className="text-xl font-bold text-green-600">
                      {earnedCommission.toLocaleString()}đ
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* ... (Các phần Link giới thiệu và Danh sách bạn bè giữ nguyên) ... */}
          {/* ----- PHẦN 3: LINK GIỚI THIỆU ----- */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Link giới thiệu</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={summary?.referralLink || ''}
                readOnly
                placeholder={loading ? "Đang tải link..." : ""}
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700"
              />
              <button
                disabled={loading}
                onClick={() => summary?.referralLink && handleCopy(summary.referralLink, 'link')}
                className={`px-4 py-2 rounded-lg transition min-w-[80px] ${copyStatus === 'link' ? 'bg-green-500 text-white' : 'bg-primary-500 text-white hover:bg-primary-600'
                  }`}
              >
                {copyStatus === 'link' ? 'Đã copy!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* ----- PHẦN 4: DANH SÁCH BẠN BÈ ----- */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-white">
              <h3 className="font-bold text-gray-800 text-lg">Danh sách bạn bè đã giới thiệu</h3>
            </div>

            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-gray-500 text-sm font-medium">Đang tải danh sách...</p>
              </div>
            ) : friends.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center">
                <p className="text-gray-500 font-medium">Chưa có bạn bè nào</p>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                <div className="space-y-1">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="group flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-100"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12">
                          <Image
                            src={friend.avatar || "https://i.pravatar.cc/150?u=default"}
                            alt={`Avatar`}
                            width={48}
                            height={48}
                            className="rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          {friend.status === 'completed' && (
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                              <div className="bg-green-500 rounded-full w-3 h-3 border border-white"></div>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-base">{friend.fullName}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <span>{friend.joinedDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1">
                        <span className={`font-bold text-base ${friend.commission > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                          +{friend.commission.toLocaleString()}đ
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${friend.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                          }`}>
                          {friend.status === 'completed' ? 'Hoàn thành' : 'Đang duyệt'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        <div>
          <BottomNav></BottomNav>
        </div>
      </div>
    </>
  );
}