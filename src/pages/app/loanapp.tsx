"use client";

import { ArrowLeft, ChevronRight, Info, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react"; // Bỏ useEffect không cần thiết

export default function LoanApplicationPage() {
    const router = useRouter();

    // --- STATE QUẢN LÝ DỮ LIỆU ĐẦU VÀO ---
    const [amount, setAmount] = useState<number>(12500);
    const [period, setPeriod] = useState<number>(12);

    // Hằng số
    const MIN_AMOUNT = 1000;
    const MAX_AMOUNT = 50000;
    const INTEREST_RATE = 9.5;
    const PROCESSING_FEE = 49.00;

    // --- [FIX LỖI]: TÍNH TOÁN TRỰC TIẾP (DERIVED STATE) ---
    // Không dùng useState hay useEffect cho các biến này.
    // Nó sẽ tự động tính lại mỗi khi component render (khi amount hoặc period đổi).

    const interestAmount = amount * (INTEREST_RATE / 100) * (period / 12);
    const totalRepayment = amount + interestAmount + PROCESSING_FEE;
    const monthlyPayment = totalRepayment / period;

    // Hàm format tiền tệ
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    // Hàm tính % để tô màu thanh slider
    const getSliderBackgroundSize = () => {
        const percentage = ((amount - MIN_AMOUNT) / (MAX_AMOUNT - MIN_AMOUNT)) * 100;
        return { backgroundSize: `${percentage}% 100%` };
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-6 font-sans">

            {/* MOBILE CONTAINER FRAME */}
            <div className="w-full max-w-[420px] bg-white h-screen md:h-auto md:min-h-[800px] md:rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative">

                {/* --- HEADER --- */}
                <header className="px-6 py-6 flex items-center justify-between sticky top-0 bg-white z-10">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-800 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-lg font-bold text-slate-900">Loan Application</h1>
                    <button className="w-10 h-10 -mr-2 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-800 transition-colors">
                        <Info size={22} />
                    </button>
                </header>

                {/* --- CONTENT --- */}
                <div className="flex-1 overflow-y-auto px-6 pb-32 no-scrollbar">

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-1.5 mb-6">
                        <div className="w-6 h-1.5 bg-blue-600 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                    </div>

                    {/* Title */}
                    <div className="mb-8 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Customize Your Loan</h2>
                        <p className="text-sm text-slate-400">Adjust the sliders to fit your needs</p>
                    </div>

                    {/* --- SLIDER SECTION --- */}
                    <div className="mb-10">
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-sm font-semibold text-slate-700">How much do you need?</span>
                            <span className="text-2xl font-bold text-blue-600">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)}
                            </span>
                        </div>

                        <div className="relative w-full h-8 flex items-center">
                            <input
                                type="range"
                                min={MIN_AMOUNT}
                                max={MAX_AMOUNT}
                                step={500}
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                style={getSliderBackgroundSize()}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb-custom focus:outline-none"
                            />
                        </div>

                        <div className="flex justify-between mt-1">
                            <span className="text-xs text-slate-400 font-medium">$1,000</span>
                            <span className="text-xs text-slate-400 font-medium">$50,000</span>
                        </div>
                    </div>

                    {/* --- PERIOD SELECTOR --- */}
                    <div className="mb-10">
                        <span className="text-sm font-semibold text-slate-700 block mb-4">Repayment period</span>
                        <div className="grid grid-cols-4 gap-3">
                            {[3, 6, 12, 24].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setPeriod(m)}
                                    className={`py-3 rounded-xl text-sm font-bold transition-all border ${period === m
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-200'
                                        }`}
                                >
                                    {m}m
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* --- SUMMARY CARD --- */}
                    <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm mb-6">
                        <p className="text-xs text-slate-400 mb-1">Monthly Installment</p>
                        <div className="flex items-baseline gap-1 mb-6">
                            <h3 className="text-3xl font-bold text-slate-900">{formatCurrency(monthlyPayment)}</h3>
                            <span className="text-sm text-slate-400 font-medium">/mo</span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Interest rate (APR)</span>
                                <span className="font-bold text-green-500">{INTEREST_RATE}%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Total repayment</span>
                                <span className="font-bold text-slate-800">{formatCurrency(totalRepayment)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Processing fee</span>
                                <span className="font-bold text-slate-800">${PROCESSING_FEE.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- FOOTER ACTION --- */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-50 z-20">
                    <div className="flex items-start gap-3 mb-5 px-1">
                        <ShieldCheck className="text-blue-600 flex-shrink-0" size={18} />
                        <p className="text-[11px] text-slate-400 leading-tight">
                            Your data is encrypted. Applying will not affect your credit score at this stage.
                        </p>
                    </div>

                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]">
                        Proceed to Apply
                        <ChevronRight size={20} />
                    </button>
                </div>

            </div>

            {/* --- CUSTOM CSS FOR SLIDER --- */}
            <style jsx>{`
                input[type=range] {
                    background-image: linear-gradient(#2563eb, #2563eb);
                    background-repeat: no-repeat;
                }
                /* Chrome, Safari, Edge, Opera */
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    background: #ffffff;
                    border: 4px solid #2563eb; 
                    cursor: pointer;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    transition: transform 0.1s;
                }
                input[type=range]::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                }
            `}</style>
        </div>
    );
}