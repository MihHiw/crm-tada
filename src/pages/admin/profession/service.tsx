import BottomNav from '@/components/BottomNav';
import Header from '@/components/Header';
import InfoRow from '@/components/InfoRow';
import { HybridService, useServicePageLogic } from '@/hooks/servicespa/useServicePageLogic';
import Head from 'next/head';
import React from 'react';

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
        // Đảm bảo ép kiểu hàm này nếu hook trả về từ formState
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

    // Ép kiểu an toàn để sử dụng các thuộc tính bên trong 'booking'
    const typed = logic as unknown as BookingData;
    const { user, logout, booking, handleStepClick } = typed;

    if (!user) return null;

    const steps = [
        { id: 1, label: 'Dịch vụ' },
        { id: 2, label: 'Chọn gói' },
        { id: 3, label: 'Xác nhận' }
    ];

    return (
        <>
            <Head><title>Mua gói dịch vụ | Vanilla Spa</title></Head>

            <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
                <div className="fixed top-0 left-0 right-0 z-50">
                    <Header user={user} logout={logout} />
                </div>

                <main className="flex-1 pt-[85px] pb-[100px] px-4 w-full max-w-4xl mx-auto space-y-6">

                    {/* THANH TIẾN TRÌNH (STEPPER) */}
                    <section className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                        <div className="flex items-center justify-between max-w-md mx-auto">
                            {steps.map((s, index) => {
                                const isActive = booking.step >= s.id;
                                const isLineActive = booking.step > s.id;
                                return (
                                    <React.Fragment key={s.id}>
                                        <div
                                            onClick={() => handleStepClick(s.id)}
                                            className="relative flex flex-col items-center z-10 cursor-pointer"
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                        ${isActive ? 'bg-primary-500 text-white border-primary-500 shadow-md' : 'bg-white text-gray-300 border-gray-200'}`}>
                                                {s.id}
                                            </div>
                                            <span className={`absolute top-full mt-2 w-24 text-center text-[10px] font-bold uppercase ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>
                                                {s.label}
                                            </span>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className={`flex-1 h-1 mx-2 rounded-full ${isLineActive ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                        <div className="h-4"></div>
                    </section>

                    {/* --- BƯỚC 1: CHỌN DỊCH VỤ --- */}
                    {booking.step === 1 && (
                        <div className="space-y-4 animate-fadeIn">
                            <h2 className="text-xl font-bold text-gray-800">1. Chọn loại dịch vụ</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {booking.services.map((service) => (
                                    <div
                                        key={service._id}
                                        onClick={() => {
                                            booking.selectService(service);
                                            // Logic tự động nhảy bước 2 thường được xử lý trong hook selectService
                                        }}
                                        className={`cursor-pointer rounded-xl border p-5 bg-white transition-all hover:shadow-md ${booking.selectedService?._id === service._id ? 'border-primary-500 ring-2 ring-primary-500/20 shadow-sm' : 'border-gray-200'
                                            }`}
                                    >
                                        <h3 className="font-bold text-gray-900 text-lg">{service.name}</h3>
                                        <p className="text-primary-600 font-bold mt-2">{service.price.toLocaleString()}đ / buổi</p>
                                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">{service.duration_min} phút thực hiện</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- BƯỚC 2: CHỌN SỐ LƯỢNG (SỬA LỖI NaN & FUNCTION NOT FOUND) --- */}
                    {booking.step === 2 && booking.selectedService && (
                        <div className="animate-fadeIn space-y-6 bg-white p-8 rounded-2xl border shadow-sm flex flex-col items-center">
                            <div className="text-center">
                                <h2 className="text-xl font-bold text-gray-800 mb-1">Thiết lập gói mua</h2>
                                <p className="text-primary-600 font-medium italic">{booking.selectedService.name}</p>
                            </div>

                            <div className="flex items-center gap-10 py-10">
                                <button
                                    onClick={() => {
                                        // Đảm bảo số lượng tối thiểu là 1
                                        const current = booking.selectedSessions || 1;
                                        if (current > 1) {
                                            booking.setSelectedSessions(current - 1);
                                        }
                                    }}
                                    className="w-14 h-14 rounded-full border-2 border-primary-500 text-primary-500 flex items-center justify-center text-3xl font-bold hover:bg-primary-50 transition-colors active:scale-90"
                                >
                                    −
                                </button>

                                <div className="text-center min-w-[100px]">
                                    <span className="text-6xl font-black text-gray-800">{booking.selectedSessions || 1}</span>
                                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2">Buổi điều trị</p>
                                </div>

                                <button
                                    onClick={() => {
                                        // Tăng số lượng lên bắt đầu từ giá trị hiện tại (hoặc 1)
                                        const current = booking.selectedSessions || 1;
                                        booking.setSelectedSessions(current + 1);
                                    }}
                                    className="w-14 h-14 rounded-full bg-primary-500 text-white flex items-center justify-center text-3xl font-bold shadow-lg hover:bg-primary-600 transition-all active:scale-90"
                                >
                                    +
                                </button>
                            </div>

                            <div className="w-full max-w-sm bg-gray-50 rounded-xl p-5 border border-dashed border-gray-300">
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <span className="text-gray-500">Đơn giá:</span>
                                    <span className="font-semibold text-gray-700">{booking.selectedService.price.toLocaleString()}đ</span>
                                </div>
                                <div className="flex justify-between items-center text-lg font-bold text-primary-600">
                                    <span>Thành tiền:</span>
                                    {/* SỬA LỖI NaN: Sử dụng totalAmount tính toán sẵn từ Hook */}
                                    <span>{booking.totalAmount.toLocaleString()}đ</span>
                                </div>
                            </div>

                            <div className="flex gap-4 w-full pt-4">
                                <button onClick={() => handleStepClick(1)} className="flex-1 py-4 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                                    Quay lại
                                </button>
                                <button
                                    onClick={() => booking.confirmDateTime()} // Hook sẽ tự nhảy step sang 3
                                    className="flex-[2] bg-primary-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-primary-700 transition-all active:scale-95"
                                >
                                    Xác nhận gói mua
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- BƯỚC 3: XÁC NHẬN THANH TOÁN --- */}
                    {booking.step === 3 && booking.selectedService && (
                        <div className="animate-fadeIn space-y-4">
                            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                                <h2 className="font-bold text-lg border-b pb-3 text-gray-800 uppercase tracking-tight">Chi tiết thanh toán</h2>

                                <div className="bg-gray-50 p-5 rounded-2xl space-y-4">
                                    <InfoRow label="Dịch vụ" value={booking.selectedService.name} />
                                    <InfoRow label="Số lượng mua" value={`${booking.selectedSessions || 1} buổi`} />
                                    <InfoRow label="Thời hạn gói" value="Không giới hạn thời gian" />
                                </div>

                                <div className="border-t border-double border-gray-200 pt-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-gray-600">Tổng thanh toán</span>
                                        <span className="text-3xl font-black text-primary-600">{booking.totalAmount.toLocaleString()}đ</span>
                                    </div>
                                    <p className="text-right text-xs text-gray-400 italic">Số dư ví khả dụng: {user.balance.toLocaleString()}đ</p>
                                </div>

                                {!booking.hasEnoughBalance && (
                                    <div className="p-4 bg-red-50 text-red-600 text-xs rounded-xl font-bold border border-red-100 flex items-center gap-3 animate-pulse">
                                        <svg fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                                        Số dư ví không đủ. Vui lòng nạp thêm để mua gói.
                                    </div>
                                )}

                                <div className="pt-4 space-y-3">
                                    <button
                                        onClick={booking.confirmBooking}
                                        disabled={booking.creating || !booking.hasEnoughBalance}
                                        className="w-full bg-primary-600 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-primary-700 disabled:bg-gray-300 disabled:shadow-none transition-all active:scale-95 flex justify-center items-center"
                                    >
                                        {booking.creating ? <><LoadingSpinner /> Đang thực hiện giao dịch...</> : 'Thanh toán & Nhận gói'}
                                    </button>

                                    <button
                                        onClick={() => handleStepClick(2)}
                                        disabled={booking.creating}
                                        className="w-full py-2 text-sm text-gray-400 font-medium hover:text-primary-500 transition-colors"
                                    >
                                        Thay đổi số lượng buổi
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <div className="fixed bottom-0 left-0 right-0 z-50">
                    <BottomNav />
                </div>
            </div>

            <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
        </>
    );
}