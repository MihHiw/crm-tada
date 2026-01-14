import { mockConsultations, mockUsers } from '@/mocks';
import { Consultation, User } from '@/types/types';
import { useCallback, useEffect, useState } from 'react';

// --- 1. TYPE DEFINITIONS ---

export type ConsultationStatus = 'PENDING' | 'CONTACTED' | 'UNREACHABLE' | 'APPOINTMENT' | 'SUCCESS' | 'CANCELLED';

export interface History {
    id: string;
    status: ConsultationStatus;
    note: string;
    created_at: string;
    createdBy: string;
}

export interface ConsultationRequest extends Omit<Consultation, 'customer_id' | 'history' | 'note'> {
    customer_name: string;
    customer_phone: string;
    customer_email?: string | null;
    customer_avatar?: string | null;
    status: ConsultationStatus;
    note?: string;
    history: History[];
}

// --- 2. INITIALIZE MOCK STORE ---

let inMemoryStore: ConsultationRequest[] = mockConsultations.map((cons) => {
    const customer = mockUsers.find((u: User) => u.id === cons.customer_id);
    const rawCons = cons as unknown as Record<string, string | undefined>;
    const initialStatus = (rawCons.status as ConsultationStatus) || 'PENDING';
    const initialNote = rawCons.note || rawCons.notes || 'Hệ thống tiếp nhận yêu cầu.';
    const initialCreator = rawCons.createdBy || 'Hệ thống';
    const initialCreatedAt = rawCons.created_at || new Date().toISOString();

    return {
        ...cons,
        // Map thông tin, sử dụng toán tử nullish coalescing (??)
        customer_name: customer?.full_name ?? rawCons.name ?? 'Khách vãng lai',
        customer_phone: customer?.phone ?? rawCons.phone ?? 'Chưa cập nhật',
        customer_email: customer?.email ?? rawCons.email ?? null,
        customer_avatar: customer?.avatar_url ?? null,
        
        status: initialStatus,
        note: initialNote,

        history: [
            {
                id: `h-init-${cons.id}`,
                status: initialStatus,
                note: initialNote,
                created_at: initialCreatedAt,
                createdBy: initialCreator
            }
        ],
    };
});

// --- 3. FAKE API ---
const fakeApi = {
    getAll: async (): Promise<ConsultationRequest[]> => {
        await new Promise((resolve) => setTimeout(resolve, 800));
        return [...inMemoryStore];
    },
    updateStatus: async (id: string, status: ConsultationStatus, note: string): Promise<boolean> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const index = inMemoryStore.findIndex((c) => c.id === id);
        if (index === -1) throw new Error("Consultation not found");

        const currentItem = inMemoryStore[index];
        
        const newHistoryEntry: History = {
            id: `hist-${Date.now()}`,
            status,
            note,
            created_at: new Date().toISOString(),
            createdBy: 'Admin',
        };

        inMemoryStore[index] = {
            ...currentItem,
            status: status,
            note: note,
            history: [newHistoryEntry, ...currentItem.history],
        };
        return true;
    },

    updateDetails: async (id: string, updateData: Partial<ConsultationRequest>): Promise<ConsultationRequest> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const index = inMemoryStore.findIndex((c) => c.id === id);
        if (index === -1) throw new Error("Consultation not found");

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
        } catch {
            setError('Không thể tải dữ liệu tư vấn.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateStatus = async (id: string, newStatus: ConsultationStatus, noteContent: string) => {
        const previousData = [...data];

        // Optimistic Update
        setData((prev) => prev.map((item) => {
            if (item.id === id) {
                const newEntry: History = {
                    id: `temp-${Date.now()}`,
                    status: newStatus,
                    note: noteContent,
                    created_at: new Date().toISOString(),
                    createdBy: 'Me'
                };
                return {
                    ...item,
                    status: newStatus,
                    note: noteContent,
                    history: [newEntry, ...item.history]
                };
            }
            return item;
        }));

        try {
            await fakeApi.updateStatus(id, newStatus, noteContent);
        } catch {
            setData(previousData);
            alert("Cập nhật trạng thái thất bại!");
        }
    };

    const updateDetails = async (id: string, updateData: Partial<ConsultationRequest>) => {
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

    const deleteRequest = async (id: string) => {
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
        refresh: fetchData
    };
};