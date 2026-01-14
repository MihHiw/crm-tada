// hooks/useStepNavigation.ts
import { useCallback } from 'react';

type Step = 1 | 2 | 3;

export function useStepNavigation(
    currentStep: Step,
    onNavigate: (step: Step) => void
) {
    const handleStepClick = useCallback((target: Step) => {
        // Logic chặn: Không cho phép nhảy đến bước tương lai (lớn hơn bước hiện tại)
        if (target > currentStep) return;

        // Nếu hợp lệ, gọi hàm điều hướng (backStep hoặc setStep)
        onNavigate(target);
    }, [currentStep, onNavigate]);

    return { handleStepClick };
}