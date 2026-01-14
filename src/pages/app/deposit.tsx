import { paymentAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

// --- PHẦN THÊM MỚI ---
interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

interface Transaction {
    _id: string;
    amount: number;
    createdAt: string;
    status: string;
    description?: string;
}
// ---------------------

export default function DepositPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const [amount, setAmount] = useState('');
    const [selectedAmount, setSelectedAmount] = useState(0);

    const quickAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

    const { data: historyData } = useQuery('deposit-history', () =>
        paymentAPI.getHistory({ type: 'deposit', limit: 10 })
    );

    const depositMutation = useMutation(
        (data: { amount: number }) => paymentAPI.createDeposit(data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('user');
                queryClient.invalidateQueries('deposit-history');
                alert('Yêu cầu nạp tiền thành công! Vui lòng chờ xác nhận.');
                setAmount('');
                setSelectedAmount(0);
            },
            // Đã sửa any thành ApiError
            onError: (error: ApiError) => {
                alert(error?.response?.data?.message || 'Có lỗi xảy ra');
            }
        }
    );

    const handleQuickAmount = (value: number) => {
        setSelectedAmount(value);
        setAmount(value.toString());
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const depositAmount = parseInt(amount);

        if (!depositAmount || depositAmount < 10000) {
            alert('Số tiền nạp tối thiểu là 10,000đ');
            return;
        }

        if (depositAmount > 50000000) {
            alert('Số tiền nạp tối đa là 50,000,000đ');
            return;
        }

        depositMutation.mutate({ amount: depositAmount });
    };

    const deposits = historyData?.data?.data?.transactions || [];

    return (
        <>
            <Head>
                <title>Nạp tiền - Booking App</title>
            </Head>
            <div className="min-h-screen bg-gray-50 pb-20">
                {/* Header */}
                <header className="bg-white shadow-sm sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
                        <button onClick={() => router.back()} className="text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">Nạp tiền</h1>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 py-6">
                    {/* Current Balance */}
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg p-6 mb-6 text-white">
                        <p className="text-sm opacity-90 mb-1">Số dư hiện tại</p>
                        <p className="text-3xl font-bold">{(user?.balance || 0).toLocaleString()}đ</p>
                    </div>

                    {/* Deposit Form */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Số tiền muốn nạp</h2>

                        {/* Quick Amount Buttons */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {quickAmounts.map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => handleQuickAmount(value)}
                                    className={`py-3 px-4 rounded-lg font-semibold transition border-2 ${selectedAmount === value
                                        ? 'border-primary-500 bg-primary-50 text-primary-600'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'
                                        }`}
                                >
                                    {(value / 1000).toLocaleString()}K
                                </button>
                            ))}
                        </div>

                        {/* Custom Amount Input */}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Hoặc nhập số tiền khác
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => {
                                            setAmount(e.target.value);
                                            setSelectedAmount(0);
                                        }}
                                        placeholder="Nhập số tiền (tối thiểu 10,000đ)"
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        min="10000"
                                        max="50000000"
                                        step="1000"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                                        đ
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Tối thiểu: 10,000đ - Tối đa: 50,000,000đ
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={!amount || depositMutation.isLoading}
                                className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {depositMutation.isLoading ? 'Đang xử lý...' : 'Nạp tiền'}
                            </button>
                        </form>
                    </div>

                    {/* Payment Instructions - GIỮ NGUYÊN */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        {/* ... Phần nội dung hướng dẫn giữ nguyên ... */}
                        <div className="flex gap-3">
                            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div className="text-sm text-blue-800">
                                <p className="font-semibold mb-1">Hướng dẫn nạp tiền:</p>
                                <ol className="list-decimal list-inside space-y-1">
                                    <li>Nhập số tiền muốn nạp và nhấn Nạp tiền</li>
                                    <li>Hệ thống sẽ tạo yêu cầu nạp tiền</li>
                                    <li>Liên hệ admin để xác nhận và chuyển khoản</li>
                                    <li>Số tiền sẽ được cộng vào tài khoản sau khi admin xác nhận</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    {/* Deposit History */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Lịch sử nạp tiền</h2>
                        {deposits.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">Chưa có giao dịch nạp tiền</p>
                        ) : (
                            <div className="space-y-3">
                                {/* Đã sửa any thành Transaction */}
                                {deposits.map((tx: Transaction) => (
                                    <div key={tx._id} className="border-b pb-3 last:border-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    +{tx.amount.toLocaleString()}đ
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(tx.createdAt).toLocaleString('vi-VN')}
                                                </p>
                                            </div>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${tx.status === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : tx.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {tx.status === 'completed'
                                                    ? 'Thành công'
                                                    : tx.status === 'pending'
                                                        ? 'Chờ xác nhận'
                                                        : 'Thất bại'}
                                            </span>
                                        </div>
                                        {tx.description && (
                                            <p className="text-sm text-gray-600">{tx.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}