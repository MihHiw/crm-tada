import {
    mockConsultations,
    mockUsers
} from '@/mocks';
import { Consultation } from '@/types/types';
import { useCallback, useEffect, useState } from 'react';

// Định nghĩa các giai đoạn chi tiết của tiến trình tư vấn
export type ConsultationStatus = 'PENDING' | 'CONTACTED' | 'UNREACHABLE' | 'APPOINTMENT' | 'SUCCESS' | 'CANCELLED';

export interface History {
    id: string;
    status: ConsultationStatus;
    note: string;
    created_at: string;
    createdBy: string;
}

// Định nghĩa Interface mở rộng cho yêu cầu xử lý trong Hook
export interface ConsultationRequest extends Omit<Consultation, 'customer_id' | 'history'> {
    customer_name: string;
    customer_phone: string;
    customer_email?: string | null;
    customer_avatar?: string | null;
    status: ConsultationStatus;
    history: History[];
}

interface MockConsultationWithHistory extends Consultation {
    history?: History[];
}

// --- 1. KHỞI TẠO STORE TỪ MOCK DATA ---
let inMemoryStore: ConsultationRequest[] = (mockConsultations as MockConsultationWithHistory[]).map((cons) => {
    const customer = mockUsers.find((u) => u.id === cons.customer_id);

    return {
        ...cons,
        customer_name: customer?.full_name ?? cons.name ?? 'Khách vãng lai',
        customer_phone: customer?.phone ?? cons.phone ?? 'Chưa cập nhật',
        customer_email: customer?.email ?? cons.email ?? null,
        customer_avatar: customer?.avatar_url ?? null,
        status: (cons.status as ConsultationStatus) || 'PENDING',
        history: cons.history && cons.history.length > 0 ? cons.history : [
            {
                id: `h-init-${cons.id}`,
                status: (cons.status as ConsultationStatus) || 'PENDING',
                note: cons.notes || 'Hệ thống tiếp nhận yêu cầu tư vấn.',
                created_at: cons.created_at,
                createdBy: 'Hệ thống'
            }
        ],
    };
});

// --- 2. FAKE API SERVICE ---
const fakeApi = {
    getAll: async (): Promise<ConsultationRequest[]> => {
        await new Promise((resolve) => setTimeout(resolve, 800));
        return [...inMemoryStore];
    },

    // --- MỚI: Hàm tạo yêu cầu ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create: async (data: any): Promise<ConsultationRequest> => {
        await new Promise((resolve) => setTimeout(resolve, 600));

        const newId = `cons-${Date.now()}`;
        const now = new Date().toISOString();

        const newItem: ConsultationRequest = {
            id: newId,
            customer_name: data.customer_name || 'Khách mới',
            customer_phone: data.customer_phone || '',
            service: data.service || 'Chưa xác định',
            notes: data.notes || '',
            source: data.source || 'Walk-in',
            status: 'PENDING',
            created_at: now,
            updated_at: now,
            customer_email: null,
            customer_avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.customer_name || 'U')}&background=random`,
            history: [
                {
                    id: `h-${Date.now()}`,
                    status: 'PENDING',
                    note: 'Tạo mới hồ sơ tư vấn',
                    created_at: now,
                    createdBy: 'Admin'
                }
            ],
            ...data
        } as ConsultationRequest;

        inMemoryStore = [newItem, ...inMemoryStore];
        return newItem;
    },

    updateStatus: async (id: string, nextStatus: ConsultationStatus, userNote: string): Promise<boolean> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const index = inMemoryStore.findIndex((c) => c.id === id);
        if (index === -1) return false;

        const currentItem = inMemoryStore[index];

        const newHistoryEntry: History = {
            id: `hist-${Date.now()}`,
            status: nextStatus,
            note: userNote,
            created_at: new Date().toISOString(),
            createdBy: 'Admin'
        };

        inMemoryStore[index] = {
            ...currentItem,
            status: nextStatus,
            history: [newHistoryEntry, ...currentItem.history],
        };

        return true;
    },

    updateDetails: async (id: string, updateData: Partial<ConsultationRequest>): Promise<ConsultationRequest> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const index = inMemoryStore.findIndex((c) => c.id === id);
        if (index === -1) throw new Error("Không tìm thấy khách hàng");

        const updatedItem = { ...inMemoryStore[index], ...updateData };
        inMemoryStore[index] = updatedItem;
        return updatedItem;
    },

    delete: async (id: string): Promise<boolean> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const initialLength = inMemoryStore.length;
        inMemoryStore = inMemoryStore.filter((c) => c.id !== id);
        return inMemoryStore.length !== initialLength;
    }
};

// --- 3. HOOK IMPLEMENTATION ---
export const useConsultationData = () => {
    const [data, setData] = useState<ConsultationRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const result = await fakeApi.getAll();
            setData(result);
            setError(null);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Không thể tải dữ liệu tư vấn.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- SỬA LỖI Ở ĐÂY ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addRequest = async (requestData: any) => {
        const tempId = `temp-${Date.now()}`;
        const tempItem: ConsultationRequest = {
            id: tempId,
            ...requestData,
            status: 'PENDING',
            customer_avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(requestData.customer_name)}&background=random`,
            history: [],
            created_at: new Date().toISOString()
        };

        setData((prev) => [tempItem, ...prev]);

        try {
            const createdItem = await fakeApi.create(requestData);
            setData((prev) => prev.map(item => item.id === tempId ? createdItem : item));
        } catch (error: unknown) { // Thay 'err' bằng 'error: unknown' để fix lỗi type
            console.error("Lỗi khi thêm mới:", error); // Sử dụng biến error để fix lỗi unused
            setData((prev) => prev.filter(item => item.id !== tempId));
            alert("Thêm mới thất bại");
        }
    };

    const updateStatus = async (id: string, newStatus: ConsultationStatus, noteContent: string): Promise<void> => {
        const previousData = [...data];

        setData((prev) => prev.map((item) => {
            if (item.id === id) {
                const newEntry: History = {
                    id: `temp-${Date.now()}`,
                    status: newStatus,
                    note: noteContent,
                    created_at: new Date().toISOString(),
                    createdBy: 'Admin'
                };
                return {
                    ...item,
                    status: newStatus,
                    history: [newEntry, ...item.history]
                };
            }
            return item;
        }));

        try {
            const success = await fakeApi.updateStatus(id, newStatus, noteContent);
            if (!success) throw new Error();
        } catch {
            setData(previousData);
            alert("Cập nhật giai đoạn thất bại!");
        }
    };

    const updateDetails = async (id: string, updateData: Partial<ConsultationRequest>): Promise<boolean> => {
        const previousData = [...data];
        setData((prev) => prev.map((item) =>
            item.id === id ? { ...item, ...updateData } : item
        ));

        try {
            const updatedItem = await fakeApi.updateDetails(id, updateData);
            setData((prev) => prev.map((item) => item.id === id ? updatedItem : item));
            return true;
        } catch {
            setData(previousData);
            return false;
        }
    };

    const deleteRequest = async (id: string): Promise<void> => {
        if (!window.confirm('Xóa yêu cầu tư vấn này?')) return;
        const previousData = [...data];
        setData((prev) => prev.filter((item) => item.id !== id));

        try {
            await fakeApi.delete(id);
        } catch {
            setData(previousData);
            alert("Không thể xóa hồ sơ!");
        }
    };

    return {
        data,
        loading,
        error,
        updateStatus,
        updateDetails,
        deleteRequest,
        addRequest,
        refresh: fetchData
    };
};