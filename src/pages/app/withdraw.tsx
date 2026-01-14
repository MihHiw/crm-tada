import { paymentAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';


// Định nghĩa kiểu cho lỗi trả về từ API (thường là Axios)
interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

// Định nghĩa kiểu cho một giao dịch (Transaction)
interface Transaction {
    _id: string;
    amount: number;
    createdAt: string;
    status: string;
    description?: string;
    metadata?: {
        bankName?: string;
        bankAccount?: string;
    };
}

export default function WithdrawPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const [amount, setAmount] = useState('');
    const [bankName, setBankName] = useState('');
    const [bankAccount, setBankAccount] = useState('');
    const [accountHolder, setAccountHolder] = useState('');

    const { data: historyData } = useQuery('withdraw-history', () =>
        paymentAPI.getHistory({ type: 'withdrawal', limit: 10 })
    );

    const withdrawMutation = useMutation(
        (data: { amount: number; bankName: string; bankAccount: string; accountHolder: string }) =>
            paymentAPI.createWithdrawal(data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('user');
                queryClient.invalidateQueries('withdraw-history');
                alert('Yêu cầu rút tiền thành công! Vui lòng chờ xác nhận.');
                setAmount('');
                setBankName('');
                setBankAccount('');
                setAccountHolder('');
            },

            onError: (error: ApiError) => {
                alert(error?.response?.data?.message || 'Có lỗi xảy ra');
            }
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const withdrawAmount = parseInt(amount);

        if (!withdrawAmount || withdrawAmount < 50000) {
            alert('Số tiền rút tối thiểu là 50,000đ');
            return;
        }

        if (withdrawAmount > (user?.balance || 0)) {
            alert('Số dư không đủ');
            return;
        }

        if (!bankName || !bankAccount || !accountHolder) {
            alert('Vui lòng điền đầy đủ thông tin ngân hàng');
            return;
        }

        withdrawMutation.mutate({
            amount: withdrawAmount,
            bankName,
            bankAccount,
            accountHolder
        });
    };

    const withdrawals = historyData?.data?.data?.transactions || [];

    return (
        <>
            <Head>
                <title>Rút tiền - Booking App</title>
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
                        <h1 className="text-xl font-bold text-gray-900">Rút tiền</h1>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 py-6">
                    {/* Current Balance */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 mb-6 text-white">
                        <p className="text-sm opacity-90 mb-1">Số dư có thể rút</p>
                        <p className="text-3xl font-bold">{(user?.balance || 0).toLocaleString()}đ</p>
                    </div>

                    {/* Withdraw Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Thông tin rút tiền</h2>

                        <div className="space-y-4">
                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Số tiền muốn rút *
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Nhập số tiền (tối thiểu 50,000đ)"
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        min="50000"
                                        max={user?.balance || 0}
                                        step="1000"
                                        required
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                                        đ
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Tối thiểu: 50,000đ - Tối đa: {(user?.balance || 0).toLocaleString()}đ
                                </p>
                            </div>

                            {/* Bank Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tên ngân hàng *
                                </label>
                                <input
                                    type="text"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    placeholder="VD: Vietcombank, Techcombank..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Bank Account */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Số tài khoản *
                                </label>
                                <input
                                    type="text"
                                    value={bankAccount}
                                    onChange={(e) => setBankAccount(e.target.value)}
                                    placeholder="Nhập số tài khoản ngân hàng"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            {/* Account Holder */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tên chủ tài khoản *
                                </label>
                                <input
                                    type="text"
                                    value={accountHolder}
                                    onChange={(e) => setAccountHolder(e.target.value)}
                                    placeholder="Tên đầy đủ theo tài khoản ngân hàng"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={withdrawMutation.isLoading}
                            className="w-full mt-6 bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {withdrawMutation.isLoading ? 'Đang xử lý...' : 'Rút tiền'}
                        </button>
                    </form>

                    {/* Warning */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <div className="flex gap-3">
                            <svg
                                className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div className="text-sm text-yellow-800">
                                <p className="font-semibold mb-1">Lưu ý quan trọng:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Kiểm tra kỹ thông tin ngân hàng trước khi gửi yêu cầu</li>
                                    <li>Thời gian xử lý: 1-3 ngày làm việc</li>
                                    <li>Phí rút tiền (nếu có) sẽ được trừ vào số tiền nhận</li>
                                    <li>Liên hệ admin nếu có thắc mắc</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Withdraw History */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Lịch sử rút tiền</h2>
                        {withdrawals.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">Chưa có giao dịch rút tiền</p>
                        ) : (
                            <div className="space-y-3">
                                {withdrawals.map((tx: Transaction) => (
                                    <div key={tx._id} className="border-b pb-3 last:border-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    -{tx.amount.toLocaleString()}đ
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(tx.createdAt).toLocaleString('vi-VN')}
                                                </p>
                                                {tx.metadata && (
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        {tx.metadata.bankName} - {tx.metadata.bankAccount}
                                                    </p>
                                                )}
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
                                                        ? 'Đang xử lý'
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