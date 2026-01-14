import Header from '@/components/Header';
import { useServicePageLogic } from '@/hooks/servicespa/useServicePageLogic';
import { Calendar, CheckCircle2, ChevronRight, Clock, Sparkles } from 'lucide-react';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function BookingPage() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
          setShowHeader(false);
        } else {
          setShowHeader(true);
        }
        setLastScrollY(currentScrollY);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const {
    user,
    logout,
    booking,
    handleStepClick,
    isReady
  } = useServicePageLogic();

  const {
    services,
    isLoading,
    step,
    selectedService,
    selectedDate,
    selectedTime,
    hasEnoughBalance,
    setSelectedDate,
    setSelectedTime,
    selectService,
    confirmDateTime,  // Hàm này đã có trong hook
    confirmBooking,
    backStep,
    generateTimeSlots,
    creating,
  } = booking;

  if (!isReady && isLoading) return (
    <div className="flex h-screen items-center justify-center bg-rose-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
    </div>
  );

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Đặt lịch Spa & Beauty</title>
      </Head>

      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="bg-white/80 backdrop-blur-md border-b border-rose-100 shadow-sm">
          <Header user={user} logout={logout} />
        </div>
      </div>

      <main className="flex-1 pt-[100px] pb-[100px] w-full min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50 font-sans">
        {/* Background blobs */}
        <div className="fixed top-20 left-0 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="fixed top-40 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        {/* --- STEPPER --- */}
        <div className="sticky top-[80px] z-40 mb-10">
          <div className="w-full max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] py-5 px-4 sm:px-12 relative border border-gray-100">
              <div className="absolute top-[38%] left-12 right-12 h-[2px] bg-gray-100 -z-0"></div>
              <div className="flex justify-between items-start relative z-10">
                {[
                  { id: 1, label: 'DỊCH VỤ', icon: Sparkles },
                  { id: 2, label: 'THỜI GIAN', icon: Calendar },
                  { id: 3, label: 'XÁC NHẬN', icon: CheckCircle2 },
                ].map((s) => {
                  const isActive = step === s.id;
                  const isCompleted = step > s.id;
                  const Icon = s.icon;

                  return (
                    <div
                      key={s.id}
                      onClick={() => handleStepClick(s.id)}
                      className={`flex flex-col items-center group cursor-pointer ${step < s.id ? 'pointer-events-none opacity-50' : ''}`}
                    >
                      <div className={`
                        relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ease-out
                        ${isActive
                          ? 'bg-rose-500 text-white shadow-lg shadow-rose-200 ring-[6px] ring-rose-100 scale-110'
                          : isCompleted
                            ? 'bg-rose-100 text-rose-500 ring-[6px] ring-gray-50'
                            : 'bg-white text-gray-300 border-2 border-gray-100'
                        }
                      `}>
                        <Icon size={isActive ? 20 : 18} strokeWidth={isActive ? 2.5 : 2} />
                      </div>
                      <span className={`
                        text-[11px] font-bold tracking-widest mt-3 uppercase transition-colors duration-300
                        ${isActive ? 'text-rose-600' : 'text-gray-400'}
                      `}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-4 relative z-10">
          {/* STEP 1: CHỌN DỊCH VỤ */}
          {step === 1 && (
            <div className="animate-fade-in-up space-y-6">
              <div className="text-center space-y-2 mb-8">
                <h2 className="text-3xl font-bold text-gray-800 font-serif">Trải nghiệm dịch vụ</h2>
                <p className="text-gray-500">Hãy chọn liệu trình thư giãn phù hợp nhất với bạn</p>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rose-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {services.map((srv, index) => (
                    <div
                      key={index}
                      // Truyền trực tiếp, không cần as any vì srv là HybridService
                      onClick={() => selectService(srv)}
                      className={`group relative bg-white rounded-3xl p-6 border transition-all duration-300 cursor-pointer overflow-hidden
                        ${selectedService?.id === srv.id
                          ? 'border-rose-500 shadow-xl shadow-rose-100/50 ring-2 ring-rose-100'
                          : 'border-transparent shadow-sm hover:shadow-xl hover:shadow-rose-100/50 hover:border-rose-100'}
                      `}
                    >
                      <div className={`absolute top-0 left-0 w-1 h-full transition-opacity ${selectedService?.id === srv.id ? 'bg-rose-500 opacity-100' : 'bg-rose-500 opacity-0 group-hover:opacity-100'}`}></div>
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-rose-600 transition-colors">
                            {srv.name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1 bg-rose-50 text-rose-600 px-2 py-1 rounded-lg">
                              <Clock size={14} />
                              {/* Dùng duration_min chuẩn từ HybridService */}
                              {srv.duration_min} phút
                            </span>
                          </div>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all transform 
                            ${selectedService?.id === srv.id
                            ? 'bg-rose-500 text-white rotate-[-45deg]'
                            : 'bg-gray-50 text-gray-400 group-hover:bg-rose-500 group-hover:text-white group-hover:rotate-[-45deg]'}
                        `}>
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: CHỌN THỜI GIAN */}
          {step === 2 && (
            <div className="animate-fade-in-up max-w-2xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[32px] shadow-xl shadow-rose-100/40 border border-white">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center font-serif">Chọn lịch hẹn</h2>
                <div className="mb-8">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Ngày mong muốn</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-rose-400">
                      <Calendar size={20} />
                    </div>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-12 pr-4 py-4 bg-rose-50/50 border border-rose-100 rounded-2xl text-gray-800 font-medium focus:ring-2 focus:ring-rose-200 focus:bg-white transition-all outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {selectedDate && (
                  <div className="animate-fade-in">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Khung giờ trống</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {generateTimeSlots().map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`
                            py-3 px-2 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden
                            ${selectedTime === time
                              ? 'bg-rose-500 text-white shadow-lg shadow-rose-300 transform -translate-y-1'
                              : 'bg-white border border-gray-100 text-gray-600 hover:border-rose-300 hover:text-rose-500 hover:shadow-md'
                            }
                          `}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-10 pt-6 border-t border-dashed border-gray-200">
                  <button
                    onClick={() => backStep(1)}
                    className="px-6 py-3 rounded-2xl text-gray-500 font-bold hover:bg-gray-50 transition-all"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={confirmDateTime}
                    disabled={!selectedDate || !selectedTime}
                    className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 disabled:opacity-50 transition-all"
                  >
                    Tiếp tục
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: XÁC NHẬN */}
          {step === 3 && selectedService && (
            <div className="animate-fade-in-up max-w-lg mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 font-serif">Xác nhận đặt lịch</h2>
              </div>

              <div className="bg-white rounded-[24px] overflow-hidden shadow-2xl shadow-rose-100 border border-white relative">
                <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-8 text-white">
                  <p className="opacity-80 text-sm uppercase tracking-wider mb-1">Dịch vụ đã chọn</p>
                  <h3 className="text-2xl font-bold leading-tight">{selectedService.name}</h3>
                  <div className="flex items-center gap-2 mt-3 opacity-90">
                    <Clock size={16} />
                    {/* Dùng duration_min chuẩn */}
                    <span>{selectedService.duration_min} phút thư giãn</span>
                  </div>
                </div>

                <div className="p-8 bg-white">
                  <div className="flex justify-between items-center mb-8 pb-8 border-b-2 border-dashed border-gray-100">
                    <div>
                      <p className="text-gray-400 text-xs uppercase font-bold">Thời gian</p>
                      <p className="text-xl font-bold text-gray-800">{selectedTime}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs uppercase font-bold">Ngày hẹn</p>
                      <p className="text-gray-800 font-medium">{selectedDate}</p>
                    </div>
                  </div>





                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => backStep(2)}
                      className="px-6 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-all"
                    >
                      Quay lại
                    </button>
                    <button
                      onClick={confirmBooking}
                      disabled={!hasEnoughBalance || creating}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {creating ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}