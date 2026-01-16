import { Sidebar } from '@/components/admin/Sidebar';
import GlobalBackground from '@/components/GlobalBackground';
import { HybridService, useServicePageLogic } from '@/hooks/servicespa/useServicePageLogic';
import { Calendar, CheckCircle2, ChevronRight, Clock, Sparkles } from 'lucide-react';
import Head from 'next/head';

// --- Interface chuẩn khớp với cấu trúc dữ liệu thực tế từ Hook ---
interface BookingData {
    user: { id: string | number; name: string; balance: number; } | null;
    logout: () => void;
    isReady: boolean;
    handleStepClick: (target: number) => void;
    booking: {
        services: HybridService[];
        step: number;
        selectedService: HybridService | null;
        selectedSessions: number;
        totalAmount: number;
        hasEnoughBalance: boolean;
        creating: boolean;
        promotionCode: string;

        // Các hàm hành động (Actions)
        setSelectedDate: (date: string) => void;
        setSelectedTime: (time: string) => void;
        selectService: (service: HybridService) => void;
        confirmDateTime: () => void;
        confirmBooking: () => void;
        backStep: (target: number) => void;
        setSelectedSessions: (n: number) => void;
    };
}

const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export default function ServicePage() {
    const logic = useServicePageLogic();

    // Ép kiểu an toàn
    const typed = logic as unknown as BookingData;
    const { user, booking, handleStepClick } = typed;

    if (!user) return null;

    const steps = [
        { id: 1, label: 'Dịch vụ', icon: Sparkles },
        { id: 2, label: 'Chọn gói', icon: Calendar },
        { id: 3, label: 'Xác nhận', icon: CheckCircle2 }
    ];

    return (
        // ROOT: Flex row layout, h-screen, text-white cho nền tối
        <div className="flex h-screen w-full overflow-hidden font-sans text-white">
            <Head><title>Mua gói dịch vụ | Vanilla Spa</title></Head>

            <GlobalBackground />

            {/* SIDEBAR */}
            <div className="w-[260px] flex-shrink-0 h-full border-r border-white/10 bg-slate-900/60 backdrop-blur-xl z-20">
                <Sidebar />
            </div>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col min-w-0 h-full relative z-10 scrollbar-hide overflow-y-auto">
                <div className="w-full max-w-5xl mx-auto p-6 md:p-10 space-y-8">

                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Mua gói dịch vụ</h1>
                        <p className="text-white/60 text-sm font-medium">Chọn dịch vụ và số lượng buổi bạn muốn mua.</p>
                    </div>

                    {/* THANH TIẾN TRÌNH (STEPPER) - Glass Style */}
                    <section className="bg-white/5 backdrop-blur-xl rounded-[2rem] shadow-lg border border-white/10 p-6 relative">
                        <div className="absolute top-1/2 left-16 right-16 h-[2px] bg-white/10 -z-0 -translate-y-1/2"></div>
                        <div className="flex items-center justify-between relative z-10 px-4 sm:px-12">
                            {steps.map((s,) => {
                                const isActive = booking.step >= s.id;
                                const isCurrent = booking.step === s.id;
                                const Icon = s.icon;
                                return (
                                    <div
                                        key={s.id}
                                        onClick={() => handleStepClick(s.id)}
                                        className={`flex flex-col items-center cursor-pointer group ${booking.step < s.id ? 'pointer-events-none' : ''}`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                                            ${isActive
                                                ? 'bg-rose-500 text-white border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                                                : 'bg-[#1e293b] text-white/30 border-white/10'
                                            } ${isCurrent ? 'scale-110 ring-4 ring-rose-500/20' : ''}`}>
                                            <Icon size={18} />
                                        </div>
                                        <span className={`mt-3 text-[10px] font-black uppercase tracking-widest transition-colors
                                            ${isActive ? 'text-white' : 'text-white/30'}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* STEP 1: CHỌN DỊCH VỤ */}
                    {booking.step === 1 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {booking.services.map((service) => (
                                    <div
                                        key={service.id}
                                        onClick={() => booking.selectService(service)}
                                        className={`group relative bg-white/5 backdrop-blur-md rounded-[2rem] p-6 border transition-all duration-300 cursor-pointer overflow-hidden
                                            ${booking.selectedService?.id === service.id
                                                ? 'border-rose-500 bg-rose-500/10 shadow-[0_0_30px_rgba(244,63,94,0.15)]'
                                                : 'border-white/10 hover:border-white/30 hover:bg-white/10'
                                            }
                                        `}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <h3 className={`text-lg font-bold transition-colors ${booking.selectedService?.id === service.id ? 'text-rose-400' : 'text-white group-hover:text-rose-300'}`}>
                                                    {service.name}
                                                </h3>
                                                <p className="text-xl font-bold text-white tracking-tight">
                                                    {service.price.toLocaleString()}$
                                                    <span className="text-sm font-normal text-white/50 ml-1">/ buổi</span>
                                                </p>
                                                <div className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-wide">
                                                    <Clock size={14} className="text-rose-400" />
                                                    {service.duration_min} phút thực hiện
                                                </div>
                                            </div>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all transform 
                                                ${booking.selectedService?.id === service.id
                                                    ? 'bg-rose-500 text-white rotate-[-45deg] shadow-lg'
                                                    : 'bg-white/10 text-white/40 group-hover:bg-rose-500 group-hover:text-white group-hover:rotate-[-45deg]'
                                                }
                                            `}>
                                                <ChevronRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: CHỌN GÓI (SỐ LƯỢNG) */}
                    {booking.step === 2 && booking.selectedService && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
                            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col items-center">
                                <div className="text-center mb-8">
                                    <h2 className="text-xl font-bold text-white mb-2">Thiết lập gói mua</h2>
                                    <p className="text-rose-400 font-bold text-lg">{booking.selectedService.name}</p>
                                </div>

                                <div className="flex items-center gap-8 mb-8">
                                    <button
                                        onClick={() => {
                                            const current = booking.selectedSessions || 1;
                                            if (current > 1) booking.setSelectedSessions(current - 1);
                                        }}
                                        className="w-14 h-14 rounded-2xl border border-white/20 text-white hover:bg-white/10 flex items-center justify-center text-2xl transition-all active:scale-95"
                                    >
                                        −
                                    </button>

                                    <div className="text-center min-w-[100px]">
                                        <span className="text-6xl font-black text-white">{booking.selectedSessions || 1}</span>
                                        <p className="text-white/40 font-bold uppercase text-[10px] tracking-widest mt-2">Buổi điều trị</p>
                                    </div>

                                    <button
                                        onClick={() => {
                                            const current = booking.selectedSessions || 1;
                                            booking.setSelectedSessions(current + 1);
                                        }}
                                        className="w-14 h-14 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-all active:scale-95"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="w-full bg-black/20 rounded-2xl p-5 border border-white/5 mb-8">
                                    <div className="flex justify-between items-center text-sm mb-2">
                                        <span className="text-white/60">Đơn giá:</span>
                                        <span className="font-bold text-white">{booking.selectedService.price.toLocaleString()}$</span>
                                    </div>
                                    <div className="flex justify-between items-center text-lg font-bold text-rose-400 border-t border-white/10 pt-2 mt-2">
                                        <span>Thành tiền:</span>
                                        <span className="text-2xl">{booking.totalAmount.toLocaleString()}$</span>
                                    </div>
                                </div>

                                <div className="flex gap-4 w-full">
                                    <button onClick={() => booking.backStep(1)} className="flex-1 py-4 rounded-xl border border-white/10 text-white/60 font-bold hover:bg-white/5 hover:text-white transition-all uppercase text-xs tracking-widest">
                                        Quay lại
                                    </button>
                                    <button
                                        onClick={() => booking.confirmDateTime()} // Hook tự nhảy step 3
                                        className="flex-[2] bg-rose-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-all active:scale-95 uppercase text-xs tracking-widest"
                                    >
                                        Xác nhận gói
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: XÁC NHẬN THANH TOÁN */}
                    {booking.step === 3 && booking.selectedService && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
                            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-6">
                                <h2 className="font-bold text-xl text-white uppercase tracking-tight text-center border-b border-white/10 pb-4">Chi tiết thanh toán</h2>

                                <div className="bg-black/20 p-6 rounded-2xl space-y-4 border border-white/5">
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-white/60 text-sm">Dịch vụ</span>
                                        <span className="text-white font-bold text-right max-w-[200px]">{booking.selectedService.name}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-white/60 text-sm">Số lượng</span>
                                        <span className="text-white font-bold">{booking.selectedSessions || 1} buổi</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-white/60 text-sm">Tổng thanh toán</span>
                                        <span className="text-3xl font-black text-rose-400">{booking.totalAmount?.toLocaleString() ?? "0"}$</span>
                                    </div>
                                    <p className="text-right text-xs text-white/40 italic">Số dư ví khả dụng: <span className="text-emerald-400 font-bold">{user.balance?.toLocaleString() ?? "0"}$</span></p>
                                </div>

                                {!booking.hasEnoughBalance && (
                                    <div className="p-4 bg-red-500/10 text-red-400 text-xs rounded-xl font-bold border border-red-500/20 flex items-center gap-3">
                                        <svg fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                                        Số dư ví không đủ. Vui lòng nạp thêm để mua gói.
                                    </div>
                                )}

                                <div className="flex gap-4 pt-2">
                                    <button onClick={() => handleStepClick(2)} className="flex-1 py-4 border border-white/10 rounded-xl font-bold text-white/60 hover:bg-white/5 hover:text-white transition-all uppercase text-xs tracking-widest">
                                        Thay đổi
                                    </button>
                                    <button
                                        onClick={booking.confirmBooking}
                                        disabled={booking.creating || !booking.hasEnoughBalance}
                                        className="flex-[2] bg-rose-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-rose-600/30 hover:bg-rose-500 disabled:bg-white/10 disabled:text-white/20 disabled:shadow-none transition-all active:scale-95 flex justify-center items-center gap-2 uppercase text-xs tracking-widest"
                                    >
                                        {booking.creating ? <><LoadingSpinner /> Đang xử lý...</> : 'Thanh toán ngay'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}