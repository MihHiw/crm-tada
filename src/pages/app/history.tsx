import BottomNav from '@/components/BottomNav';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

// 1. Import Types:
// Giả sử 'BookingExtended' được export từ file hook như đã làm ở bước trước
import { useHistoryData, BookingExtended } from '@/hooks/history/useHistoryData';
// Import WalletTransaction từ file types gốc của bạn
import { WalletTransaction } from '@/types/types'; 

// --- HELPER COMPONENTS (Badge) ---
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  const labels: Record<string, string> = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy'
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {labels[status] || status}
    </span>
  );
};

const TransactionBadge = ({ type }: { type: string }) => {
  const styles: Record<string, string> = {
    deposit: 'bg-green-100 text-green-800',
    withdrawal: 'bg-red-100 text-red-800',
    payment: 'bg-blue-100 text-blue-800',
    refund: 'bg-purple-100 text-purple-800',
    commission: 'bg-orange-100 text-orange-800'
  };
  const labels: Record<string, string> = {
    deposit: 'Nạp tiền',
    withdrawal: 'Rút tiền',
    payment: 'Thanh toán',
    refund: 'Hoàn tiền',
    commission: 'Hoa hồng'
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${styles[type] || 'bg-gray-100 text-gray-800'}`}>
      {labels[type] || type}
    </span>
  );
};

export default function HistoryPage() {
  const router = useRouter();
  const { tab = 'bookings' } = router.query;
  const [activeTab, setActiveTab] = useState(tab as string);
  const [statusFilter, setStatusFilter] = useState('all');

  // --- UI Effects (Scroll Header) ---
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- DATA FETCHING ---
  // Hook này đã trả về mảng có kiểu BookingExtended[] và WalletTransaction[]
  const { bookings, transactions, loading } = useHistoryData(statusFilter);

  return (
    <>
      <Head>
        <title>Lịch sử - Booking App</title>
      </Head>
      <div className="min-h-screen bg-gray-50 pb-20 pt-[76px]">

        {/* --- HEADER --- */}
        <header className={`bg-white shadow-sm fixed top-0 left-0 right-0 z-20 transition-transform duration-300 ease-in-out ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
            <button onClick={() => router.push('/app')} className="text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900">Lịch sử</h1>
          </div>
        </header>

        {/* --- TABS --- */}
        <div className={`bg-white border-b sticky z-10 transition-[top] duration-300 ease-in-out ${showHeader ? 'top-[60px]' : 'top-0'}`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-2 border-b-2 font-semibold transition ${activeTab === 'bookings' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-600'}`}
              >
                Lịch đặt
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-4 px-2 border-b-2 font-semibold transition ${activeTab === 'transactions' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-600'}`}
              >
                Giao dịch
              </button>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <main className="max-w-7xl mx-auto px-4 py-6">

          {/* TAB: BOOKINGS */}
          {activeTab === 'bookings' && (
            <>
              {/* Filter Chips */}
              <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${statusFilter === status ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    {status === 'all' ? 'Tất cả' :
                      status === 'pending' ? 'Chờ xác nhận' :
                        status === 'confirmed' ? 'Đã xác nhận' :
                          status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                  </button>
                ))}
              </div>

              {/* Booking List */}
              {loading ? (
                <div className="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
              ) : bookings.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <p className="text-gray-500 mb-4">Chưa có lịch đặt nào</p>
                  <Link href="/app/booking" className="inline-block px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition">
                    Đặt lịch ngay
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* SỬA LỖI 1: Thay 'any' bằng 'BookingExtended' */}
                  {bookings.map((booking: BookingExtended) => (
                    <div key={booking.id} className="bg-white rounded-lg shadow-sm p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{booking.service_name}</h3>
                          {/* Kiểm tra optional chaining nếu location có thể null */}
                          {booking.location && <p className="text-sm text-gray-600">{booking.location}</p>}
                        </div>
                        <StatusBadge status={booking.status} />
                      </div>

                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {booking.start_time ? new Date(booking.start_time).toLocaleString('vi-VN') : '---'}
                          </span>
                        </div>
                        {booking.duration_minutes && (
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              {booking.duration_minutes} phút
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Tổng tiền:</span>
                        <span className="font-bold text-primary-600">
                          {/* Kiểm tra cả 2 trường hợp tên biến tiền */}
                          {(booking.total_amount || booking.amount || 0).toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* TAB: TRANSACTIONS */}
          {activeTab === 'transactions' && (
            <>
              {loading ? (
                <div className="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
              ) : transactions.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <p className="text-gray-500">Chưa có giao dịch nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* SỬA LỖI 2: Thay 'any' bằng 'WalletTransaction' */}
                  {transactions.map((tx: WalletTransaction) => (
                    <div key={tx.id} className="bg-white rounded-lg shadow-sm p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0 pr-3">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <TransactionBadge type={tx.type} />
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {new Date(tx.created_at).toLocaleString('vi-VN')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 break-words line-clamp-2">{tx.description}</p>
                        </div>
                        <span className={`font-bold text-lg whitespace-nowrap ${['deposit', 'refund', 'commission'].includes(tx.type) ? 'text-green-600' : 'text-red-600'}`}>
                          {['deposit', 'refund', 'commission'].includes(tx.type) ? '+' : '-'}
                          {tx.amount.toLocaleString()}đ
                        </span>
                      </div>

                      {(tx.balance_before !== undefined || tx.balance_after !== undefined) && (
                        <div className="text-xs text-gray-500 flex flex-wrap justify-between gap-y-1 pt-2 border-t mt-2">
                          {tx.balance_before !== undefined && <span>Trước: {tx.balance_before.toLocaleString()}đ</span>}
                          {tx.balance_after !== undefined && <span>Sau: {tx.balance_after.toLocaleString()}đ</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
          <div className="max-w-7xl mx-auto px-4">
            <BottomNav />
          </div>
        </nav>
      </div>
    </>
  );
}