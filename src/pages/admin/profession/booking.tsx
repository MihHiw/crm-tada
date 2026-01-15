import { Sidebar } from '@/components/admin/Sidebar';
import GlobalBackground from '@/components/GlobalBackground';
import { useServicePageLogic } from '@/hooks/servicespa/useServicePageLogic';
import { Calendar, CheckCircle2, ChevronRight, Clock, Sparkles } from 'lucide-react';
import Head from 'next/head';
import Swal from 'sweetalert2';

export default function BookingPage() {
  const {
    user,
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
    setSelectedDate,
    setSelectedTime,
    selectService,
    confirmDateTime,
    confirmBooking,
    backStep,
    generateTimeSlots,
    creating,
  } = booking;

  // --- HÀM XỬ LÝ SỰ KIỆN XÁC NHẬN ---
  const handleConfirmBooking = async () => {
    try {
      await confirmBooking();

      await Swal.fire({
        icon: 'success',
        title: '<span class="text-emerald-400 font-bold">Đặt lịch thành công!</span>',
        html: '<p class="text-white/80">Cảm ơn bạn đã tin tưởng dịch vụ của Vanilla Spa.<br/>Chúng tôi đang chờ đón bạn.</p>',
        background: 'rgba(30, 41, 59, 0.9)',
        color: '#fff',
        confirmButtonText: 'Tuyệt vời',
        confirmButtonColor: '#10b981',
        backdrop: `rgba(0,0,0,0.6)`,
        customClass: {
          popup: 'border border-white/10 rounded-[2rem] backdrop-blur-xl shadow-2xl',
          confirmButton: 'rounded-xl px-6 py-3 font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/30'
        }
      });

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Có lỗi xảy ra',
        text: 'Vui lòng thử lại sau!',
        background: '#1e293b',
        color: '#fff',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'border border-white/10 rounded-[2rem]',
        }
      });
    }
  };

  if (!isReady && isLoading) return (
    <div className="flex h-screen items-center justify-center bg-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans text-white">

      <GlobalBackground />

      <Head>
        <title>Đặt lịch Spa & Beauty</title>
      </Head>

      {/* Sidebar */}
      <div className="w-[260px] flex-shrink-0 h-full border-r border-white/10 bg-slate-900/60 backdrop-blur-xl z-50">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative z-10 scrollbar-hide overflow-y-auto">

        <main className="flex-1 px-8 pb-[100px] w-full pt-8">

          {/* STEPPER */}
          <div className="sticky top-4 z-30 mb-10">
            <div className="w-full max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-full shadow-2xl border border-white/20 py-4 px-8 relative">
                <div className="absolute top-1/2 left-12 right-12 h-[2px] bg-white/10 -z-0 -translate-y-1/2"></div>

                <div className="flex justify-between items-center relative z-10">
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
                        className={`flex flex-col items-center group cursor-pointer transition-all ${step < s.id ? 'pointer-events-none opacity-50' : ''}`}
                      >
                        <div className={`
                          relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                          ${isActive
                            ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-110 border-4 border-[#1e293b]'
                            : isCompleted
                              ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50'
                              : 'bg-white/10 text-white/40 border-2 border-white/10 hover:border-white/30 hover:text-white'
                          }
                        `}>
                          <Icon size={isActive ? 20 : 18} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className={`
                          text-[10px] font-black tracking-widest mt-2 uppercase transition-colors duration-300
                          ${isActive ? 'text-emerald-400' : 'text-white/40'}
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

          <div className="w-full max-w-5xl mx-auto">

            {/* STEP 1: CHỌN DỊCH VỤ */}
            {step === 1 && (
              <div className="animate-fade-in-up space-y-8">
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-3xl font-black text-white uppercase tracking-tight">Trải nghiệm dịch vụ</h2>
                  <p className="text-white/60 font-medium">Hãy chọn liệu trình thư giãn phù hợp nhất với bạn</p>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((srv, index) => (
                      <div
                        key={index}
                        onClick={() => selectService(srv)}
                        className={`group relative bg-white/5 backdrop-blur-md rounded-[2rem] p-6 border transition-all duration-300 cursor-pointer overflow-hidden
                          ${selectedService?.id === srv.id
                            ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
                            : 'border-white/10 hover:border-white/30 hover:bg-white/10'}
                        `}
                      >
                        <div className="flex justify-between items-start relative z-10">
                          <div className="space-y-3">
                            <h3 className={`text-lg font-bold transition-colors ${selectedService?.id === srv.id ? 'text-emerald-400' : 'text-white group-hover:text-emerald-300'}`}>
                              {srv.name}
                            </h3>
                            <div className="flex items-center gap-3 text-sm">
                              <span className="flex items-center gap-1.5 bg-white/10 text-white/80 px-3 py-1.5 rounded-xl border border-white/5 backdrop-blur-sm">
                                <Clock size={14} className="text-emerald-400" />
                                <span className="font-bold text-xs uppercase tracking-wide">{srv.duration_min} phút</span>
                              </span>
                            </div>
                          </div>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all transform 
                              ${selectedService?.id === srv.id
                              ? 'bg-emerald-500 text-white rotate-[-45deg] shadow-lg'
                              : 'bg-white/10 text-white/40 group-hover:bg-emerald-500 group-hover:text-white group-hover:rotate-[-45deg]'}
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
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/10">
                  <h2 className="text-2xl font-black text-white mb-8 text-center uppercase tracking-tight">Chọn lịch hẹn</h2>

                  <div className="mb-8">
                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3 ml-1">Ngày mong muốn</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-emerald-400">
                        <Calendar size={20} />
                      </div>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-14 pr-6 py-4 bg-black/30 border border-white/10 rounded-2xl text-white font-bold focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all outline-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {selectedDate && (
                    <div className="animate-fade-in">
                      <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3 ml-1">Khung giờ trống</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {generateTimeSlots().map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`
                              py-3 px-2 rounded-xl text-xs font-bold transition-all duration-300 relative overflow-hidden
                              ${selectedTime === time
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transform -translate-y-1'
                                : 'bg-white/5 border border-white/10 text-white/70 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-white/10'
                              }
                            `}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 mt-10 pt-6 border-t border-white/10">
                    <button
                      onClick={() => backStep(1)}
                      className="px-8 py-3 rounded-xl border border-white/10 text-white/60 font-bold hover:bg-white/5 hover:text-white transition-all text-xs uppercase tracking-widest"
                    >
                      Quay lại
                    </button>
                    <button
                      onClick={confirmDateTime}
                      disabled={!selectedDate || !selectedTime}
                      className="flex-1 py-4 rounded-xl bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.15em] shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Xác nhận đặt lịch</h2>
                </div>

                <div className="bg-[#1e293b] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 relative">
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-10 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <p className="opacity-70 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Dịch vụ đã chọn</p>
                    <h3 className="text-2xl font-black leading-tight tracking-tight">{selectedService.name}</h3>
                    <div className="flex items-center gap-2 mt-4 opacity-90 bg-black/20 w-fit px-3 py-1.5 rounded-lg backdrop-blur-sm">
                      <Clock size={14} />
                      <span className="text-xs font-bold uppercase tracking-wide">{selectedService.duration_min} phút thư giãn</span>
                    </div>
                  </div>

                  <div className="p-8 bg-white/5 backdrop-blur-xl">
                    <div className="flex justify-between items-center mb-8 pb-8 border-b border-dashed border-white/10">
                      <div>
                        <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-1">Thời gian</p>
                        <p className="text-2xl font-black text-white tracking-tight">{selectedTime}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-1">Ngày hẹn</p>
                        <p className="text-lg font-bold text-white/90">{selectedDate}</p>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={() => backStep(2)}
                        className="px-6 py-3 rounded-xl border border-white/10 text-white/50 font-bold hover:bg-white/5 hover:text-white transition-all text-xs uppercase tracking-widest"
                      >
                        Quay lại
                      </button>

                      <button
                        onClick={handleConfirmBooking}
                        disabled={creating}
                        className="flex-1 py-3 rounded-xl bg-white text-slate-900 font-black text-xs uppercase tracking-[0.15em] shadow-lg hover:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
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
      </div>
    </div>
  );
}