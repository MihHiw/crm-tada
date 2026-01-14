"use client";

import { DocumentType } from "@/styles/types";
import { ChevronLeft, HelpCircle, Image as ImageIcon, Zap, ZapOff } from "lucide-react";
import { useState } from "react";

interface Props {
    side: 'front' | 'back';
    docType: DocumentType;
    onCapture: () => void;
    onBack?: () => void;
}

export default function StepCamera({ side, docType, onCapture, onBack }: Props) {
    const [isFlashOn, setIsFlashOn] = useState(false);

    // --- [LOGIC 1] TEXT HIỂN THỊ VIỆT HÓA & ĐỘNG ---
    // Tiêu đề chính
    const headerTitle = "Xác thực danh tính";

    // Tên loại giấy tờ
    const docName = docType === 'cccd' ? 'CCCD/CMND' : 'Giấy phép lái xe';

    // Hướng dẫn chính (Thay đổi theo mặt Trước/Sau)
    const mainInstruction = side === 'front'
        ? `Chụp mặt trước ${docName}`
        : `Chụp mặt sau ${docName}`;

    // Số bước
    const stepCount = docType === 'cccd' ? "2/4" : "3/4";

    return (
        <div className="flex flex-col h-full bg-slate-950 relative overflow-hidden text-white font-sans">

            <div className="pt-4 px-4 pb-2 z-20 bg-slate-950/50 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft size={24} className="text-white" />
                    </button>
                    <span className="font-bold text-base md:text-lg tracking-wide">{headerTitle}</span>
                    <div className="w-10"></div>
                </div>

                {/* Progress Info */}
                <div className="flex justify-between items-end mb-2 px-2">
                    <span className="text-sm font-medium text-slate-300">Tiến độ xác thực</span>
                    <span className="text-xs font-bold text-slate-500">{stepCount}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-1/2 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.8)]"></div>
                </div>
            </div>

            {/* --- INSTRUCTION TEXT (TEXT HƯỚNG DẪN TO) --- */}
            <div className="py-4 text-center z-20 relative px-6">
                <h2 className="text-xl md:text-2xl font-bold mb-2 text-white">{mainInstruction}</h2>
                <p className="text-slate-400 text-sm max-w-[300px] mx-auto leading-relaxed">
                    Di chuyển giấy tờ vào giữa khung hình.<br />
                    Đảm bảo hình ảnh rõ nét, không bị lóa sáng.
                </p>
            </div>

            {/* --- CAMERA AREA --- */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">

                {/* Background Camera */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-60"></div>

                {/* --- [NEW] BADGE NỔI BẬT TRONG KHUNG --- */}
                {/* Cái này giúp người dùng nhìn vào giữa màn hình là biết ngay cần chụp gì */}
                <div className="absolute top-4 z-30 animate-bounce-slow">
                    <span className={`
                        px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg backdrop-blur-md border border-white/20
                        ${side === 'front' ? 'bg-blue-600 text-white' : 'bg-orange-600 text-white'}
                    `}>
                        {side === 'front' ? 'Mặt Trước' : 'Mặt Sau'}
                    </span>
                </div>

                {/* OVERLAY TỐI */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative w-[90%] md:w-[500px] aspect-[1.586/1] rounded-2xl shadow-[0_0_0_9999px_rgba(2,6,23,0.85)] z-10">
                        {/* Góc khung xanh */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-[4px] border-l-[4px] border-blue-500 rounded-tl-xl -mt-[2px] -ml-[2px]"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-[4px] border-r-[4px] border-blue-500 rounded-tr-xl -mt-[2px] -mr-[2px]"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[4px] border-l-[4px] border-blue-500 rounded-bl-xl -mb-[2px] -ml-[2px]"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[4px] border-r-[4px] border-blue-500 rounded-br-xl -mb-[2px] -mr-[2px]"></div>

                        {/* Tia quét */}
                        <div className="absolute top-0 left-2 right-2 h-0.5 bg-blue-400 shadow-[0_0_15px_rgba(59,130,246,1)] animate-scan opacity-80"></div>
                    </div>
                </div>

                {/* --- BOTTOM INDICATOR (THANH CHUYỂN TRẠNG THÁI) --- */}
                <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center">
                    <div className="bg-slate-900/80 backdrop-blur-md p-1.5 rounded-full flex gap-1 border border-white/10 shadow-xl">
                        {/* Nút Mặt Trước */}
                        <div className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${side === 'front' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'text-slate-500'
                            }`}>
                            <div className={`w-2 h-2 rounded-full ${side === 'front' ? 'bg-white' : 'bg-slate-600'}`}></div>
                            Mặt Trước
                        </div>

                        {/* Nút Mặt Sau */}
                        <div className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${side === 'back' ? 'bg-orange-600 text-white shadow-lg scale-105' : 'text-slate-500'
                            }`}>
                            <div className={`w-2 h-2 rounded-full ${side === 'back' ? 'bg-white' : 'bg-slate-600'}`}></div>
                            Mặt Sau
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FOOTER CONTROLS --- */}
            <div className="bg-slate-950 pt-4 pb-8 px-8 z-20">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <button className="w-12 h-12 rounded-full bg-slate-800/50 hover:bg-slate-700 flex items-center justify-center text-white border border-white/10 transition-transform active:scale-95">
                        <ImageIcon size={20} />
                    </button>

                    <button
                        onClick={onCapture}
                        className="group relative w-20 h-20 flex items-center justify-center active:scale-95 transition-transform"
                    >
                        <div className="absolute inset-0 rounded-full border-[4px] border-white/30 group-hover:border-white/60 transition-colors"></div>
                        <div className="absolute inset-1 rounded-full border-[2px] border-white"></div>
                        <div className="w-[60px] h-[60px] rounded-full bg-white group-hover:bg-blue-50 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"></div>
                    </button>

                    <button
                        onClick={() => setIsFlashOn(!isFlashOn)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center border border-white/10 transition-transform active:scale-95 ${isFlashOn ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'bg-slate-800/50 text-white'
                            }`}
                    >
                        {isFlashOn ? <Zap size={20} fill="currentColor" /> : <ZapOff size={20} />}
                    </button>
                </div>

                <button className="w-full flex items-center justify-center gap-2 mt-6 text-blue-500 text-xs font-medium hover:text-blue-400 transition-colors">
                    <HelpCircle size={14} /> Hướng dẫn chụp ảnh
                </button>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan { animation: scan 3s linear infinite; }
                
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-slow { animation: bounce-slow 2s infinite ease-in-out; }
            `}</style>
        </div>
    );
}