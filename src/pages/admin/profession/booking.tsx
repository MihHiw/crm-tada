import { Sidebar } from '@/components/admin/Sidebar';
import GlobalBackground from '@/components/GlobalBackground';
import { useServicePageLogic } from '@/hooks/servicespa/useServicePageLogic';
import { Calendar, CheckCircle2, ChevronRight, Clock, Sparkles } from 'lucide-react';
import Head from 'next/head';
import Swal from 'sweetalert2';

export default function BookingPage() {
  const { user, booking, handleStepClick, isReady } = useServicePageLogic();

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

  const handleConfirmBooking = async () => {
    try {
      await confirmBooking();
      await Swal.fire({
        icon: 'success',
        title: '<span class="text-emerald-400 font-bold">Đặt lịch thành công!</span>',
        html: '<p class="text-white/80">Cảm ơn bạn đã tin tưởng Vanilla Spa.<br/>Chúng tôi đã sẵn sàng phục vụ bạn.</p>',
        background: 'rgba(15, 23, 42, 0.9)',
        color: '#fff',
        confirmButtonText: 'Tuyệt vời',
        confirmButtonColor: '#10b981',
        backdrop: `rgba(0,0,0,0.7)`,
        customClass: {
          popup: 'border border-emerald-500/20 rounded-[2rem] backdrop-blur-2xl shadow-2xl',
          confirmButton: 'rounded-xl px-8 py-3 font-bold uppercase tracking-widest'
        }
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Rất tiếc...',
        text: 'Có lỗi xảy ra, vui lòng kiểm tra lại!',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  if (!isReady && isLoading) return (
    <div className="flex h-screen items-center justify-center bg-[#020617]">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-emerald-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 bg-emerald-500/20 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden text-slate-200 selection:bg-emerald-500/30 relative">

      {/* 1. LAYER NỀN TOÀN CỤC */}
      <GlobalBackground />

      <Head><title>Booking | Biztada Spa</title></Head>

      {/* 2. SIDEBAR VỚI ĐỘ TRONG SUỐT NHẸ */}
      <aside className="w-[280px] flex-shrink-0 h-full border-r border-white/10 bg-slate-950/20 backdrop-blur-3xl z-50">
        <Sidebar />
      </aside>

      {/* 3. NỘI DUNG CHÍNH */}
      <main className="flex-1 flex flex-col relative z-10 overflow-y-auto scroll-smooth bg-transparent">
        <div className="max-w-6xl mx-auto w-full px-6 py-12">

          {/* STEPPER - THANH TIẾN TRÌNH */}
          <div className="mb-16">
            <div className="max-w-2xl mx-auto bg-white/[0.05] border border-white/10 p-2 rounded-3xl backdrop-blur-md shadow-2xl">
              <div className="flex justify-between relative px-4 py-1">
                {[
                  { id: 1, label: 'Dịch vụ', icon: Sparkles },
                  { id: 2, label: 'Thời gian', icon: Calendar },
                  { id: 3, label: 'Xác nhận', icon: CheckCircle2 },
                ].map((s) => {
                  const isActive = step === s.id;
                  const isDone = step > s.id;
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleStepClick(s.id)}
                      disabled={step < s.id}
                      className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-500 ${isActive
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40'
                        : isDone ? 'text-emerald-400' : 'text-slate-500 opacity-50 cursor-not-allowed'
                        }`}
                    >
                      <Icon size={isActive ? 20 : 18} />
                      <span className="text-sm font-bold tracking-wide uppercase">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* DIỆN TÍCH HIỂN THỊ CÁC BƯỚC */}
          <div className="min-h-[500px]">

            {/* BƯỚC 1: CHỌN DỊCH VỤ */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-white mb-1 tracking-tight">Trải nghiệm dịch vụ</h2>
                  <p className="text-white/60 text-sm font-medium">Chọn liệu trình tinh hoa dành riêng cho bạn</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((srv, index) => (
                    <div
                      key={index}
                      onClick={() => selectService(srv)}
                      className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 cursor-pointer overflow-hidden backdrop-blur-sm ${selectedService?.id === srv.id
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-2xl shadow-emerald-500/20'
                        : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/30'
                        }`}
                    >
                      <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-2xl transition-colors ${selectedService?.id === srv.id ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-400'}`}>
                              <Sparkles size={24} />
                            </div>
                            <div className="text-right">
                              <span className="block text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-1">Giá từ</span>
                              <span className="text-2xl font-black text-emerald-400">${srv.price}</span>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-emerald-300 transition-colors">
                            {srv.name}
                          </h3>
                        </div>
                        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                          <span className="text-sm text-slate-400 font-medium">Chi tiết dịch vụ</span>
                          <ChevronRight size={20} className={`transition-transform duration-300 ${selectedService?.id === srv.id ? 'translate-x-1 text-emerald-400' : 'text-slate-600 group-hover:text-white'}`} />
                        </div>
                      </div>
                      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/30 transition-all"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BƯỚC 2: CHỌN THỜI GIAN */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-3xl mx-auto">
                <div className="bg-white/[0.05] border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl shadow-2xl">
                  <h2 className="text-3xl font-black text-white mb-10 text-center tracking-tight uppercase">Chọn thời gian</h2>
                  <div className="space-y-10">
                    <div className="relative group">
                      <label className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4 block ml-2">1. Chọn ngày hẹn</label>
                      <div className="relative">
                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" size={22} />
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-16 pr-8 py-5 bg-black/40 border border-white/10 rounded-2xl text-lg font-bold text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all outline-none"
                        />
                      </div>
                    </div>

                    {selectedDate && (
                      <div className="animate-in fade-in duration-500">
                        <label className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4 block ml-2">2. Khung giờ khả dụng</label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                          {generateTimeSlots().map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`py-4 rounded-xl text-sm font-bold transition-all duration-300 border ${selectedTime === time
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-xl shadow-emerald-500/40 transform -translate-y-1'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:border-emerald-500/50 hover:text-white hover:bg-white/10'
                                }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4 pt-10 mt-6 border-t border-white/10">
                      <button onClick={() => backStep(1)} className="px-10 py-4 rounded-2xl border border-white/10 text-slate-400 font-bold hover:bg-white/10 hover:text-white transition-all">Quay lại</button>
                      <button
                        onClick={confirmDateTime}
                        disabled={!selectedDate || !selectedTime}
                        className="flex-1 py-4 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-wider shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 disabled:opacity-30 transition-all"
                      >
                        Tiếp tục bước cuối
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BƯỚC 3: XÁC NHẬN */}
            {step === 3 && selectedService && (
              <div className="animate-in zoom-in-95 duration-500 max-w-lg mx-auto">
                <div className="bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-12 text-white relative">
                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-4">Hoàn tất đặt lịch</p>
                      <h3 className="text-4xl font-black mb-6 leading-none tracking-tight">{selectedService.name}</h3>
                      <div className="inline-flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                        <Clock size={16} />
                        <span className="text-sm font-bold">{selectedService.duration_min} phút trị liệu</span>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                  </div>

                  <div className="p-10 space-y-8">
                    <div className="grid grid-cols-2 gap-8 border-b border-white/10 pb-8">
                      <div>
                        <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2">Giờ hẹn</p>
                        <p className="text-3xl font-black text-white">{selectedTime}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2">Ngày</p>
                        <p className="text-xl font-bold text-slate-200">
                          {new Date(selectedDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button onClick={() => backStep(2)} className="px-6 py-4 rounded-2xl border border-white/10 text-slate-500 font-bold hover:text-white hover:bg-white/5 transition-all">Sửa lại</button>
                      <button
                        onClick={handleConfirmBooking}
                        disabled={creating}
                        className="flex-1 py-4 rounded-2xl bg-white text-slate-950 font-black uppercase tracking-widest hover:bg-emerald-400 hover:text-white transition-all shadow-xl disabled:opacity-50"
                      >
                        {creating ? 'Đang xác nhận...' : 'Xác nhận ngay'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}