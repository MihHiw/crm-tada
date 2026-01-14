"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Import types và components
import { Step, UserInfo } from "@/styles/types";

import StepCamera from "./StepCamera";
import StepFaceScan from "./StepFaceScan";
import StepInputForm from "./StepInputForm";
import StepIntro from "./StepIntro";
import StepProcessing from "./StepProcessing";
import StepSuccess from "./StepSuccess";

export default function KYCFlow() {
    const router = useRouter();

    // Bắt đầu từ màn hình INTRO
    const [currentStep, setCurrentStep] = useState<Step>('INTRO');

    // State lưu thông tin
    const [userInfo, setUserInfo] = useState<UserInfo>({
        fullName: '', idNumber: '', licenseNumber: '', dob: '', address: ''
    });

    // --- [FIX LỖI GIAO DIỆN] ---
    // Biến này kiểm tra xem bước hiện tại có phải là bước cần Full màn hình tối không
    const isImmersiveStep = ['CCCD_FRONT', 'CCCD_BACK', 'LICENSE_FRONT', 'LICENSE_BACK', 'FACE_SCAN'].includes(currentStep);

    // --- 1. LOGIC TÍNH % TIẾN TRÌNH ---
    const getProgress = () => {
        switch (currentStep) {
            case 'INTRO': return 0;
            case 'FORM_INPUT': return 20;
            case 'CCCD_FRONT': return 35;
            case 'CCCD_BACK': return 50;
            case 'LICENSE_FRONT': return 65;
            case 'LICENSE_BACK': return 80;
            case 'FACE_SCAN': return 90;
            case 'PROCESSING': return 95;
            case 'SUCCESS': return 100;
            default: return 0;
        }
    };

    // --- LOGIC CHUYỂN BƯỚC ---
    const handleNext = () => {
        if (currentStep === 'INTRO') setCurrentStep('FORM_INPUT');
        else if (currentStep === 'FORM_INPUT') setCurrentStep('CCCD_FRONT');
    };

    const handleCapture = () => {
        if (currentStep === 'CCCD_FRONT') setCurrentStep('CCCD_BACK');
        else if (currentStep === 'CCCD_BACK') setCurrentStep('LICENSE_FRONT');
        else if (currentStep === 'LICENSE_FRONT') setCurrentStep('LICENSE_BACK');
        else if (currentStep === 'LICENSE_BACK') setCurrentStep('FACE_SCAN');
    };

    const handleFinishKYC = () => {
        setCurrentStep('PROCESSING');
        setTimeout(() => {
            setCurrentStep('SUCCESS');
        }, 3000);
    };

    const handleBack = () => {
        switch (currentStep) {
            case 'INTRO': router.back(); break;
            case 'FORM_INPUT': setCurrentStep('INTRO'); break;
            case 'CCCD_FRONT': setCurrentStep('FORM_INPUT'); break;
            case 'CCCD_BACK': setCurrentStep('CCCD_FRONT'); break;
            case 'LICENSE_FRONT': setCurrentStep('CCCD_BACK'); break;
            case 'LICENSE_BACK': setCurrentStep('LICENSE_FRONT'); break;
            case 'FACE_SCAN': setCurrentStep('LICENSE_BACK'); break;
            default: break;
        }
    };

    const getHeaderTitle = () => {
        switch (currentStep) {
            case 'INTRO': return 'Xác thực nâng cao';
            case 'FORM_INPUT': return 'Thông tin cá nhân';
            case 'SUCCESS': return 'Hoàn tất';
            default: return 'Đang xử lý';
        }
    };

    return (
        // Container ngoài cùng: Chuyển màu nền trang web tùy theo bước
        <div className={`min-h-screen flex items-center justify-center font-sans p-0 md:p-4 transition-colors duration-300 ${isImmersiveStep ? 'bg-slate-900' : 'bg-slate-50 md:bg-slate-100'
            }`}>

            {/* CONTAINER CHÍNH (Cái khung bo tròn) */}
            <div className={`
                w-full max-w-lg overflow-hidden flex flex-col min-h-screen md:min-h-[700px] transition-all duration-300
                ${isImmersiveStep
                    ? 'bg-slate-950 md:rounded-[2rem] md:shadow-2xl border-slate-900 shadow-black' // Style TỐI cho Camera
                    : 'bg-white md:rounded-[2rem] md:shadow-2xl md:border border-slate-200'         // Style SÁNG cho Form
                }
            `}>

                {/* HEADER: Chỉ hiện khi KHÔNG PHẢI bước Camera */}
                {!isImmersiveStep && !['SUCCESS'].includes(currentStep) && (
                    <>
                        <header className="flex items-center p-4 bg-white sticky top-0 z-30">
                            <button
                                onClick={handleBack}
                                className={`p-2 hover:bg-slate-100 rounded-full transition-colors ${['INTRO', 'PROCESSING'].includes(currentStep) ? 'invisible' : ''
                                    }`}
                            >
                                <ChevronLeft className="w-6 h-6 text-slate-600" />
                            </button>
                            <h1 className="flex-1 text-center text-lg font-bold text-slate-800">
                                {getHeaderTitle()}
                            </h1>
                            <div className="w-10"></div>
                        </header>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-slate-100 sticky top-[60px] z-20">
                            <div
                                className="h-full bg-blue-600 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                                style={{ width: `${getProgress()}%` }}
                            ></div>
                        </div>
                    </>
                )}

                {/* MAIN CONTENT AREA */}
                {/* QUAN TRỌNG: p-0 (bỏ padding) nếu là Camera để tràn viền */}
                <main className={`flex-1 w-full flex flex-col transition-all duration-300 ${isImmersiveStep
                    ? 'p-0 bg-slate-950' // Camera: Full màn hình, nền đen
                    : 'p-4 md:p-6 bg-slate-50 md:bg-white' // Form: Có lề, nền trắng
                    }`}>

                    {/* 1. Intro */}
                    {currentStep === 'INTRO' && <StepIntro onNext={handleNext} />}

                    {/* 2. Form Input */}
                    {currentStep === 'FORM_INPUT' && (
                        <StepInputForm userInfo={userInfo} setUserInfo={setUserInfo} onNext={handleNext} />
                    )}

                    {/* 3. Camera Steps (Full Screen) */}
                    {(currentStep === 'CCCD_FRONT' || currentStep === 'CCCD_BACK') && (
                        <StepCamera
                            side={currentStep === 'CCCD_FRONT' ? 'front' : 'back'}
                            docType="cccd"
                            onCapture={handleCapture}
                            onBack={handleBack}
                        />
                    )}

                    {(currentStep === 'LICENSE_FRONT' || currentStep === 'LICENSE_BACK') && (
                        <StepCamera
                            side={currentStep === 'LICENSE_FRONT' ? 'front' : 'back'}
                            docType="license"
                            onCapture={handleCapture}
                        />
                    )}

                    {currentStep === 'FACE_SCAN' && <StepFaceScan onFinish={handleFinishKYC} />}

                    {/* 4. Kết quả */}
                    {currentStep === 'PROCESSING' && <StepProcessing />}
                    {currentStep === 'SUCCESS' && <StepSuccess />}

                </main>
            </div>
        </div>
    );
}