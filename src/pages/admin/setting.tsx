"use client";
import Sidebar from '@/components/admin/Sidebar';
import { useSettings } from '@/hooks/setup/useSettings';
import {
    Bell,
    Eye,
    EyeOff,
    Save,
    ShieldCheck,
    User as UserIcon
} from 'lucide-react';
import { useSyncExternalStore } from 'react';

const subscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function SettingsPage() {
    const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const {
        activeTab, setActiveTab, currentUser, setCurrentUser,
        passwordData, setPasswordData, showPassword, togglePasswordVisibility,
        isSaving, handleSaveProfile
    } = useSettings();

    if (!isClient || !currentUser) return null;

    return (
        <div className="flex min-h-screen bg-[#0B0F1A]">
            <Sidebar adminName={currentUser.name} />

            <main className="flex-1 p-8 space-y-8 overflow-y-auto text-left">
                <header>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Cài đặt tài khoản</h1>
                    <p className="text-gray-500 text-sm mt-1">Quản lý thông tin và bảo mật cá nhân của bạn</p>
                </header>

                <div className="grid grid-cols-12 gap-8">
                    {/* Tabs Navigation */}
                    <div className="col-span-12 lg:col-span-3 space-y-2">
                        {[
                            { id: 'profile', label: 'Hồ sơ', icon: UserIcon },
                            { id: 'security', label: 'Bảo mật', icon: ShieldCheck },
                            { id: 'notifications', label: 'Thông báo', icon: Bell },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                    : 'text-gray-500 hover:bg-gray-800/40 hover:text-white'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="col-span-12 lg:col-span-9">
                        <div className="bg-[#161D2F] rounded-[32px] border border-gray-800 p-8 shadow-sm">

                            {/* Tab Hồ sơ */}
                            {activeTab === 'profile' && (
                                <form onSubmit={handleSaveProfile} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1 tracking-wider">Tên hiển thị</label>
                                            <input
                                                type="text"
                                                value={currentUser.name}
                                                onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                                                className="w-full bg-[#0B0F1A] border border-gray-800 rounded-xl py-3 px-4 text-sm text-white focus:border-blue-600 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-gray-500 font-bold uppercase ml-1 tracking-wider">Email hệ thống</label>
                                            <input
                                                type="text"
                                                value={currentUser.email}
                                                disabled
                                                className="w-full bg-[#0B0F1A] border border-gray-800 rounded-xl py-3 px-4 text-sm text-gray-500 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            <Save size={16} /> {isSaving ? "Đang xử lý..." : "Lưu thay đổi"}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Tab Bảo mật - Có tính năng Xem mật khẩu */}
                            {activeTab === 'security' && (
                                <form onSubmit={handleSaveProfile} className="space-y-6 max-w-md">
                                    {/* Mật khẩu hiện tại */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-gray-500 font-bold uppercase ml-1 tracking-wider">Mật khẩu hiện tại</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword.current ? "text" : "password"}
                                                placeholder="••••••••"
                                                autoComplete="current-password"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                className="w-full bg-[#0B0F1A] border border-gray-800 rounded-xl py-3 px-4 pr-12 text-sm text-white focus:border-blue-600 outline-none transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility('current')}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                            >
                                                {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Mật khẩu mới */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-gray-500 font-bold uppercase ml-1 tracking-wider">Mật khẩu mới</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword.new ? "text" : "password"}
                                                placeholder="••••••••"
                                                autoComplete="new-password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                className="w-full bg-[#0B0F1A] border border-gray-800 rounded-xl py-3 px-4 pr-12 text-sm text-white focus:border-blue-600 outline-none transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility('new')}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                            >
                                                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Xác nhận mật khẩu mới */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-gray-500 font-bold uppercase ml-1 tracking-wider">Xác nhận mật khẩu mới</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword.confirm ? "text" : "password"}
                                                placeholder="••••••••"
                                                autoComplete="new-password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                className="w-full bg-[#0B0F1A] border border-gray-800 rounded-xl py-3 px-4 pr-12 text-sm text-white focus:border-blue-600 outline-none transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility('confirm')}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                            >
                                                {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-start pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                                        >
                                            {isSaving ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                                        </button>
                                    </div>
                                </form>
                            )}

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}